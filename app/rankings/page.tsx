"use client";

import { useState, useEffect } from "react";
import DatePicker from "@/components/DatePicker";
import SongList from "@/components/SongList";
import { useSearchParams } from 'next/navigation'

// Type for the Ranking data and Song (with relevant fields)
type Song = {
  name: string;
  spotify_id: string;
};

type Ranking = {
  spotify_id: string;
  daily_rank: number;
  albumCover: string | null;
  snapshot_date: string;
  Songs: Song;
};

export default function RankingsPage() {
  const searchParams = useSearchParams()  // Read URL params
  const country = searchParams.get('country')
  const countryId = searchParams.get('countryId')

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [rankings, setRankings] = useState<Ranking[]>([]); 
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [minDate, setMinDate] = useState<string>("");
  const [maxDate, setMaxDate] = useState<string>("");
  const [dateRangeLoading, setDateRangeLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the possible dates for the datepicker
    const fetchDateRange = async () => {
      try {
        const response = await fetch("/api/rankings-dates");
        const data = await response.json();

        if (response.ok) {
          setMinDate(data.minDate);
          setMaxDate(data.maxDate);
          setStartDate(data.minDate);
          setEndDate(data.maxDate);
        } else {
          throw new Error(data.error || "Failed to fetch date range");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setDateRangeLoading(false);
      }
    };

    fetchDateRange();
  }, []);

  const fetchRankings = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/rankings?countryId=${countryId}&startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch rankings");
      }

      setRankings(data); // Store the full rankings data

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Song Rankings</h1>

      {/* Date Picker Component */}
      <DatePicker
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        minDate={minDate}
        maxDate={maxDate}
        dateRangeLoading={dateRangeLoading}
        fetchRankings={fetchRankings}
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500 font-semibold">{error}</p>}

      {/* Song List Component */}
      {!loading && !error && rankings.length > 0 && (
        <SongList
          rankings={rankings}
          selectedSongs={selectedSongs}
          onSelectionChange={setSelectedSongs}
        />
      )}

      {!loading && !error && rankings.length === 0 && <p>No Songs found.</p>}

      {/* JUST FOR TESTING: Display Selected Songs */}
      {selectedSongs.length > 0 && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h2 className="text-lg font-semibold mb-2">Selected Songs:</h2>
          <ul className="list-disc list-inside">
            {selectedSongs.map((song, index) => (
              <li key={index}>{song.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* TODO: Add WordCloud, Heatmap, Radar Chart Components*/}
    </div>
  );
}
