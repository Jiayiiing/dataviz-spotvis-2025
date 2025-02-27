"use client";

import React, { useState } from "react";
import WordCloud from "@/components/WordCloud";
import { format } from "date-fns";

export default function WordCloudPage() {
  const [startDate, setStartDate] = useState<string>("2025-01-10");
  const [endDate, setEndDate] = useState<string>("2025-01-10");
  const [countryId, setCountry] = useState<number>(14);
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRankings = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/rankings?startDate=${startDate}&endDate=${endDate}&countryId=${countryId}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch rankings");
      }

      setSongs(data);
      console.log(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const testString =
    "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time tozz get to sea as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the ship. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean with me.";
  //console.log(songs);
  const artistsRankings = calculateArtistPopularity(songs);
  console.log(artistsRankings);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Song Rankings</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={fetchRankings}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Fetch Rankings
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {error && <p className="text-red-500 font-semibold">{error}</p>}

      {!loading && !error && songs.length > 0 && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Song</th>
              <th className="border p-2">Country</th>
              <th className="border p-2">Rank</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Loudness</th>
              <th className="border p-2">Energy</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song, index) => (
              <tr key={index} className="border">
                <td className="border p-2">{song.Songs?.name || "Unknown"}</td>
                <td className="border p-2">
                  {song.Countries?.country || "Unknown"}
                </td>
                <td className="border p-2">{song.daily_rank}</td>
                <td className="border p-2">
                  {format(new Date(song.snapshot_date), "yyyy-MM-dd")}
                </td>
                <td className="border p-2">{song.Songs?.loudness || "N/A"}</td>
                <td className="border p-2">{song.Songs?.energy || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && songs.length === 0 && <p>No rankings found.</p>}
      <WordCloud data={artistsRankings} width={600} height={400} />
    </div>
  );
}

type Word = {
  text: string;
  value: number;
};

type Artist = {
  name: string;
};

type SongArtist = {
  Artists: Artist;
};

type SongsContainer = {
  [key: string]: SongArtist[] | unknown; // Songs object contains an array and possibly other properties
};

type DataEntry = {
  daily_rank: number;
  Songs: SongsContainer;
};

const calculateArtistPopularity = (data: DataEntry[]): Word[] => {
  const artistScores: Record<string, number> = {};

  data.forEach((entry) => {
    const points = 51 - entry.daily_rank; // Calculate points based on the song's rank

    // Extract the artist array from the Songs object
    const artistArray = Object.values(entry.Songs).find((item) => Array.isArray(item)) as SongArtist[] | undefined;

    if (!artistArray) {
      console.warn("No valid artist array found in:", entry.Songs);
      return; // Skip if no valid artist array
    }

    artistArray.forEach((artistEntry: SongArtist) => {
      const artistName = artistEntry.Artists.name;
      artistScores[artistName] = (artistScores[artistName] || 0) + points;
    });
  });

  return Object.entries(artistScores).map(([artist, score]) => ({
    text: artist,
    value: score,
  }));
};


