"use client"; // Required for useState & useEffect

import { useState } from "react";
import { format } from "date-fns";

export default function RankingsPage() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 

  const fetchRankings = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    setError(null); 

    try {
      const response = await fetch(`/api/rankings?startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch rankings");
      }

      setSongs(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

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
}
