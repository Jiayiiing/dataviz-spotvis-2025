"use client";

import React, { useState } from "react";
import WordCloud from "@/components/WordCloud";
import { format } from "date-fns";

export default function WordCloudPage() {
  const [startDate, setStartDate] = useState<string>("2025-01-10");
  const [endDate, setEndDate] = useState<string>("2025-01-10");
  const [country, setCountry] = useState<number>(14);
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 

  const fetchRankings = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    setError(null); 

    try {
      const response = await fetch(`/api/rankings?startDate=${startDate}&endDate=${endDate}&country_id=${country}`);
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

  const testString = "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time tozz get to sea as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the ship. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean with me.";
  const data = generateWordData(testString);
  //console.log(data);

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
                <td className="border p-2">{song.Countries?.country || "Unknown"}</td>
                <td className="border p-2">{song.daily_rank}</td>
                <td className="border p-2">{format(new Date(song.snapshot_date), "yyyy-MM-dd")}</td>
                <td className="border p-2">{song.Songs?.loudness || "N/A"}</td>
                <td className="border p-2">{song.Songs?.energy || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && songs.length === 0 && <p>No rankings found.</p>}
    </div>
  );

  /*
  return (
    <div >
      <WordCloud data={data} width={600} height={400} />
    </div>
  );
  */
}

type Word = {
  text: string;
  value: number;
};

const generateWordData = (text: string): Word[] => {
  const words = text.split(/\s+/); // Split by spaces
  const wordCountMap: Record<string, number> = {};

  words.forEach((word) => {
    wordCountMap[word] = (wordCountMap[word] || 0) + 1;
  });

  return Object.entries(wordCountMap).map(([word, count]) => ({
    text: word,
    value: count,
  }));
};