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
  onSelectionChange: (selectedSongs: Song[]) => void; // Function to update the selected songs
};

export default function SongList({
  rankings,
  selectedSongs,
  onSelectionChange,
}: SongListProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const uniqueDates = Array.from(new Set(rankings.map((ranking) => ranking.snapshot_date)));
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
  
  const handleCheckboxChange = (song: Song, isChecked: boolean) => {
    if (isChecked) {
      // Add song to selectedSongs when checked
      onSelectionChange([...selectedSongs, song]);
    } else {
      // Remove song from selectedSongs when unchecked
      onSelectionChange(
        selectedSongs.filter((s) => s.spotify_id !== song.spotify_id)
      );
    }
    console.log(selectedSongs)
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Song List</h2>

      {/* Date Selector */}
      <div className="mb-4">
        <label className="mr-2">Select Date:</label>
        <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="p-2 border rounded">
          <option value="">All Dates</option>
          {uniqueDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-dark-200">
            <th className="border p-2">Select</th>
            <th className="border p-2">Album</th>
            <th className="border p-2">Song Name</th>
            <th className="border p-2">Artists</th>
          </tr>
        </thead>
        <tbody>
          {(() => {
            const seenSongs = new Set(); // Store unique song IDs

            return rankings
              .filter((ranking) => !selectedDate || ranking.snapshot_date === selectedDate)
              .filter((ranking) => {
                if (seenSongs.has(ranking.spotify_id)) return false; // Skip duplicates
                seenSongs.add(ranking.spotify_id); // Mark as seen
                return true;
              })
              .map((ranking) => (
                <tr key={ranking.spotify_id}>
                  <td className="border p-2">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleCheckboxChange(ranking.Songs, e.target.checked)
                      }
                    />
                  </td>
                  <td className="border p-2">
                    {albumCovers[ranking.spotify_id] ? (
                      <img
                        src={albumCovers[ranking.spotify_id]!}
                        alt="Album Cover"
                        className="w-12 h-12 rounded"
                      />
                    ) : (
                      <span>Loading...</span>
                    )}
                  </td>
                  <td className="border p-2">{ranking.Songs.name}</td>
                  <td className="border p-2">
                    {ranking.Songs.Song_artists
                      .map((songArtist) => songArtist.Artists.name)
                      .join(", ") || "Unknown Artist"}
                  </td>
                </tr>
              ));
          })()}
        </tbody>
      </table>
    </div>
  );
}
