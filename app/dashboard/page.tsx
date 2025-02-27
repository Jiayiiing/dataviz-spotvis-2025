"use client";
import { Suspense } from "react";
import { useState, useEffect } from "react";
import DatePicker from "@/components/DatePicker";
import SongList from "@/components/SongList";
import WordCloud from "@/components/WordCloud";
import HeatmapChart from "@/components/heatmap";
import Radartest from "@/app/radartest/page";
//import RadarChart from "@/components/RadarChart"; // Ensure this component exists
import { useSearchParams } from "next/navigation";

// Type definitions
type Song = { name: string; spotify_id: string };
type Ranking = { spotify_id: string; daily_rank: number; albumCover: string | null; snapshot_date: string; Songs: Song };
type Word = { text: string; value: number };
type Artist = { name: string };
type SongArtist = { Artists: Artist };
type SongsContainer = { [key: string]: SongArtist[] | unknown };
type DataEntry = { daily_rank: number; Songs: SongsContainer };

// Calculate artist popularity for WordCloud
const calculateArtistPopularity = (data: DataEntry[]): Word[] => {
  const artistScores: Record<string, number> = {};

  data.forEach((entry) => {
    const points = 51 - entry.daily_rank;
    const artistArray = Object.values(entry.Songs).find((item) => Array.isArray(item)) as SongArtist[] | undefined;

    if (!artistArray) return;

    artistArray.forEach((artistEntry: SongArtist) => {
      const artistName = artistEntry.Artists.name;
      artistScores[artistName] = (artistScores[artistName] || 0) + points;
    });
  });

  return Object.entries(artistScores).map(([artist, score]) => ({ text: artist, value: score }));
};

export default function RankingsPage() {
   const searchParams = useSearchParams();
  const countryId = searchParams.get('countryId');

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [minDate, setMinDate] = useState<string>("");
  const [maxDate, setMaxDate] = useState<string>("");
  const [dateRangeLoading, setDateRangeLoading] = useState<boolean>(true);

  // Fetch available date range for the date picker
  useEffect(() => {
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

  // Fetch rankings data
  const fetchRankings = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/rankings?countryId=${countryId}&startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch rankings");

      setRankings(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const artistsRankings = calculateArtistPopularity(rankings);

  return (
    <div className="p-4 max-w-5xl mx-auto flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Song Rankings</h1>

      {/* Date Picker Centered */}
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

      {/* 2x2 Grid Layout */}
      <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full mt-6">
        {/* WordCloud */}
        <div className="p-4 border rounded bg-gray-100 flex justify-center items-center">
          <Suspense fallback={<p>Loading WordCloud...</p>}>
            <WordCloud data={artistsRankings} width={300} height={250} />
          </Suspense>
        </div>

        {/* Heatmap */}
        <div className="p-4 border rounded bg-gray-100 flex justify-center items-center">
          <Suspense fallback={<p>Loading Heatmap...</p>}>
            <HeatmapChart />
          </Suspense>
        </div>

        {/* Radar Chart */}
        <div className="p-4 border rounded bg-gray-100 flex flex-col justify-center items-center">
          <h1>Radar Chart</h1>
          <Suspense fallback={<p>Loading Radar Chart...</p>}>
            <Radartest />
          </Suspense>
        </div>

        {/* Song List */}
        <div className="p-4 border rounded bg-gray-100 overflow-auto">
          <SongList
            rankings={rankings}
            selectedSongs={selectedSongs}
            onSelectionChange={setSelectedSongs}
          />
        </div>
      </div>

      {/* Selected Songs List */}
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
    </div>
  );
}
