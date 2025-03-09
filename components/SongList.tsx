"use client";

import { getAlbumCover } from "@/utils/SpotifyAPI/spotifyApi";
import { useState, useEffect } from "react";

type Song = {
  name: string;
  spotify_id: string;
  energy: number;
  danceability: number;
  valence: number;
  acousticness: number;
  popularity: number;
  liveness: number;
  Song_artists: SongArtist[];
};

type Artist = { name: string };
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
  const [albumCovers, setAlbumCovers] = useState<Record<string, string | null>>(
    {}
  );
  const uniqueDates = Array.from(
    new Set(rankings.map((ranking) => ranking.snapshot_date))
  ).sort();
  const [selectedDate, setSelectedDate] = useState<string>(""); // Start as empty
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false); // Tracks slider interaction

  // Ensure selectedDate is set to uniqueDates[0] in the beginning.
  useEffect(() => {
    if (uniqueDates.length > 0 && !selectedDate) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [uniqueDates, selectedDate]); // Runs when uniqueDates or selectedDate changes

  /*
  useEffect(() => {
    const fetchAlbumCovers = async () => {
      const uniqueIds = Array.from(
        new Set(rankings.map((entry) => entry.spotify_id))
      ); // Unique IDs
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
      onSelectionChange(
        selectedSongs.filter((s) => s.spotify_id !== song.spotify_id)
      );
    } else {
      onSelectionChange([...selectedSongs, song]);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedIndex = parseInt(e.target.value, 10);
    const actualDate = uniqueDates[selectedIndex]; // Get the actual date using the index
    setSelectedDate(actualDate);
    setHasUserInteracted(true);
    console.log(actualDate);
  };

  const effectiveDate = hasUserInteracted ? selectedDate : uniqueDates[0];

  return (
    <div className="relative">
      {/* Clear Selection Button */}
      <button
        onClick={() => onSelectionChange([])}
        className="absolute top-0 right-0 mt-2 mr-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 shadow-md"
      >
        Clear Selection
      </button>
      <h2 className="text-xl font-bold mb-4">Song List</h2>

      {/* Date Selector */}
      <div className="mb-4">
        <label className="mr-2">Selected Date:</label>
        <span className="text-lg font-semibold text-blue-500">
          {selectedDate}
        </span>
        <input
          type="range"
          min={0}
          max={uniqueDates.length - 1}
          value={uniqueDates.indexOf(selectedDate)}
          onChange={handleSliderChange}
          className="w-full"
          onClick={(e) => e.stopPropagation()}
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
            .filter((ranking) => ranking.snapshot_date === effectiveDate)
            .filter((ranking) => {
              if (seenSongs.has(ranking.spotify_id)) return false; // Skip duplicates
              seenSongs.add(ranking.spotify_id); // Mark as seen
              return true;
            })
            .filter((ranking) => {
              // Filter songs based on selected artists
              if (selectedArtists.length === 0) return true; // If no artists are selected, show all songs
              return ranking.Songs.Song_artists.some((songArtist) =>
                selectedArtists.some(
                  (artist) =>
                    artist.name.trim() === songArtist.Artists.name.trim()
                )
              );
            })
            .map((ranking) => (
              <div
                key={ranking.spotify_id}
                className="flex items-center p-4 h-20 border border-gray-300 rounded-lg shadow-md hover:shadow-lg"
              >
                {/*
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
                */}
                <div className="flex-1">
                  <div className="text-sm text-white">
                    <span className="font-bold">Title:</span>{" "}
                    <a
                      href={`https://open.spotify.com/track/${ranking.Songs.spotify_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "rgb(29,185,84)" }}
                      className="underline"
                    >
                      {ranking.Songs.name}
                    </a>
                  </div>
                  <div className="text-sm text-white">
                    <span className="font-bold">Artists:</span>{" "}
                    {ranking.Songs.Song_artists.map(
                      (songArtist) => songArtist.Artists.name
                    ).join(", ") || "Unknown Artist"}
                  </div>
                  <div className="text-sm text-white">
                    <span className="font-bold">Rank:</span>{" "}
                    {ranking.daily_rank}
                  </div>
                </div>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handlePlusButtonClick(ranking.Songs);
                  }}
                  className={`p-2 ml-auto rounded ${selectedSongs.some((s) => s.spotify_id === ranking.Songs.spotify_id) ? "bg-green-500 text-white" : "bg-gray-300 text-black"}`}
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
