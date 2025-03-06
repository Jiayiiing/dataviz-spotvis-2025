"use client";

import { getAlbumCover } from "@/utils/SpotifyAPI/spotifyApi";
import { useState, useEffect} from "react";


type Song = {
  name: string;
  spotify_id: string;
  energy: number;
  danceability: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number; 
  Song_artists: SongArtist[];};

type Artist = { id: number, name: string };
type SongArtist = { Artists: Artist };

type Ranking = {
  spotify_id: string;
  daily_rank: number;
  snapshot_date: string;
  albumCover: string | null; // albumCover moved to the ranking level
  Songs: Song;
};

type SongListProps = {
  rankings: Ranking[]; // Array of Song objects
  selectedSongs: Song[]; // Array of selected Song objects
  selectedArtists: Artist[];
  onSelectionChange: (selectedSongs: Song[]) => void; // Function to update the selected songs
};

export default function SongList({
  rankings,
  selectedSongs,
  selectedArtists,
  onSelectionChange,
}: SongListProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const uniqueDates = Array.from(new Set(rankings.map((ranking) => ranking.snapshot_date))).sort();
  const [albumCovers, setAlbumCovers] = useState<Record<string, string | null>>({});


  /*
  useEffect(() => {
    const fetchAlbumCovers = async () => {
      const uniqueIds = Array.from(new Set(rankings.map((entry) => entry.spotify_id))); // Unique IDs
      const covers: Record<string, string | null> = {};
  
      await Promise.all(
        uniqueIds
          .filter((id) => !albumCovers[id]) // Only fetch if not already in state
          .map(async (spotifyId) => {
            const cover = await getAlbumCover(spotifyId);
            covers[spotifyId] = cover;
          })
      );
  
      setAlbumCovers((prevCovers) => ({ ...prevCovers, ...covers }));
    };
  
    fetchAlbumCovers();
  }, [rankings]);
  */
  
  const handlePlusButtonClick = (song: Song) => {
    if (selectedSongs.some((s) => s.spotify_id === song.spotify_id)) {
      // Deselect song
      onSelectionChange(selectedSongs.filter((s) => s.spotify_id !== song.spotify_id));
    } else {
      onSelectionChange([...selectedSongs, song]);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedIndex = parseInt(e.target.value, 10);
    const actualDate = uniqueDates[selectedIndex]; // Get the actual date using the index
    setSelectedDate(actualDate); 
    console.log(actualDate);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Song List</h2>

      {/* Date Selector */}
      <div className="mb-4">
        <label className="mr-2">Selected Date:</label>
        <span className="text-lg font-semibold text-blue-500">{selectedDate || "Select a date"}</span>
        <input
          type="range"
          min={0}
          max={uniqueDates.length - 1}
          value={uniqueDates.indexOf(selectedDate)}
          onChange={handleSliderChange}
          className="w-full"
        />
         <div className="flex justify-between">
          <span>{uniqueDates[0]}</span>
          <span>{uniqueDates[uniqueDates.length - 1]}</span>
        </div>
      </div>


      {/* Song Cards */}
      <div className="space-y-4">
        {(() => {
          const seenSongs = new Set(); // Store unique song IDs

          return rankings
            .filter((ranking) => !selectedDate || ranking.snapshot_date === selectedDate)
            .filter((ranking) => {
              if (seenSongs.has(ranking.spotify_id)) return false; // Skip duplicates
              seenSongs.add(ranking.spotify_id); // Mark as seen
              return true;
            })
            .filter((ranking) => {
              // Filter songs based on selected artists
              if (selectedArtists.length === 0) return true; // If no artists are selected, show all songs
              return ranking.Songs.Song_artists.some((songArtist) =>
                selectedArtists.some((artist) => artist.id === songArtist.Artists.id)
              );
            })
            .map((ranking) => (
              <div key={ranking.spotify_id} className="flex items-center p-4 border border-gray-300 rounded-lg shadow-md hover:shadow-lg">
                <div className="w-16 h-16 mr-4">
                  {albumCovers[ranking.spotify_id] ? (
                    <img
                      src={albumCovers[ranking.spotify_id]!}
                      alt="Album Cover"
                      className="w-full h-full rounded"
                    />
                  ) : (
                    <span>Loading...</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg">{ranking.Songs.name}</div>
                  <div className="italic text-gray-600">
                    {ranking.Songs.Song_artists
                      .map((songArtist) => songArtist.Artists.name)
                      .join(", ") || "Unknown Artist"}
                  </div>
                  <div className="text-sm text-gray-500">Rank: {ranking.daily_rank}</div>
                </div>
                <button
                  onClick={() => handlePlusButtonClick(ranking.Songs)}
                  className={`p-2 rounded ${selectedSongs.some((s) => s.spotify_id === ranking.Songs.spotify_id) ? "bg-green-500 text-white" : "bg-gray-300 text-black"}`}
                >
                  +
                </button>
              </div>
            ));
        })()}
      </div>
    </div>
  );
}
