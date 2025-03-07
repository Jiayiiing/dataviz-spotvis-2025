"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DatePicker from "@/components/DatePicker";
import SongList from "@/components/SongList";
import WordCloud from "@/components/WordCloud";
import HeatmapChart from "@/components/heatmap";
import Radartest from "@/components/radartest";
import BackArrow from "@/components/backarrow";
import TitleHeader from "@/components/titleHeader";
import Radarchart_explain from "@/components/radarchart-explain";

// Type definitions
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

type Ranking = {
  spotify_id: string;
  daily_rank: number;
  albumCover: string | null;
  snapshot_date: string;
  Songs: Song;
};

type Word = { text: string; value: number };
type Artist = { name: string };
type SongArtist = { Artists: Artist };
type SongsContainer = { [key: string]: SongArtist[] | unknown };
type DataEntry = { daily_rank: number; Songs: SongsContainer };
type SeriesEntry = { x: string; y: number };
type Series = { name: string; data: SeriesEntry[] };

// Calculate artist popularity for WordCloud
const calculateArtistPopularity = (data: DataEntry[]): Word[] => {
  const artistScores = new Map<string, number>(); // Map keyed by artist name

  data.forEach((entry) => {
    const points = 51 - entry.daily_rank;
    const artistArray = Object.values(entry.Songs).find((item) =>
      Array.isArray(item)
    ) as SongArtist[] | undefined;

    if (!artistArray) return;

    const processedArtists = new Set<string>(); // Track processed artist names for this entry

    artistArray.forEach((artistEntry: SongArtist) => {
      const name = artistEntry.Artists.name.trim(); // Sanitize name

      if (processedArtists.has(name)) return; // Skip duplicate artist in this entry
      processedArtists.add(name);

      artistScores.set(name, (artistScores.get(name) || 0) + points);
    });
  });

  return Array.from(artistScores, ([name, score]) => ({
    text: name,
    value: score,
  }));
};

const formatHeatmapData = (data: Ranking[]): Series[] => {
  const artistMap = new Map();

  // Collect all unique dates and sort them
  const allDates = Array.from(
    new Set(data.map(({ snapshot_date }) => snapshot_date))
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  //console.log("All dates", allDates);

  data.forEach((entry) => {
    entry.Songs.Song_artists.forEach((artistEntry: SongArtist) => {
      const artist_name = artistEntry.Artists.name.trim();
      const currentRank = entry.daily_rank;
      const snapshotDate = entry.snapshot_date;

      if (!artistMap.has(artist_name)) {
        artistMap.set(artist_name, new Map());
      }

      const rankMap = artistMap.get(artist_name);
      const existingRank = rankMap.get(snapshotDate) ?? 51;

      // Update only if the new rank is better (lower)
      if (currentRank < existingRank) {
        rankMap.set(snapshotDate, currentRank);
      }
    });
  });

  // Convert artistMap into the final series format
  const formattedData: Series[] = Array.from(
    artistMap,
    ([artist, rankMap]) => ({
      name: artist,
      data: allDates.map((date) => ({
        x: date,
        y: rankMap.get(date) ?? null, // Use the best rank found or null if no data
      })),
    })
  );

  return formattedData;
};

export default function RankingsPage() {
  const searchParams = useSearchParams();
  const countryId = searchParams.get("countryId");

  const [startDate, setStartDate] = useState<string>("2024-10-18");
  const [endDate, setEndDate] = useState<string>("");
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRangeLoading, setDateRangeLoading] = useState<boolean>(true);
  const [expandedCell, setExpandedCell] = useState<number | null>(null);

  const minDate = "2023-10-18";
  const maxDate = "2025-02-17";

  // Fetch rankings data
  const fetchRankings = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/rankings?countryId=${countryId}&startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to fetch rankings");

      setRankings(data);
      console.log("Data fetched");
      //console.log(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Data for the word cloud
  const artistsRankings = calculateArtistPopularity(rankings);
  console.log("Rankings Result:", artistsRankings);

  // Data for the heatmap
  const heatmapData = formatHeatmapData(rankings);

  //consts for setting radarchart pop up information
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const openPopup = () => {
    setIsPopupOpen(true);
  };
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const toggleExpand = (index: number) => {
    setExpandedCell(expandedCell === index ? null : index);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpandedCell(null); // Reset expanded cell
      }
    };
  
    document.addEventListener("keydown", handleKeyDown);
  
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="p-2 max-w-5xl mx-auto flex flex-col items-center">
      <TitleHeader />
      <div className="absolute top-4 left-4">
        <BackArrow />
      </div>
      {/* Date Picker */}
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

      {expandedCell !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-40"></div>
      )}

      <div className="grid grid-cols-2 grid-rows-2 gap-3 w-[95vw] max-w-screen-3xl mt-6 h-[75vh] overflow-hidden">
        {/* WordCloud */}
        <div
          className={`p-4 border rounded bg-[var(--grid-bg-color)] flex flex-col justify-center items-center overflow-auto 
      transition-all duration-300 ease-in-out cursor-pointer hover:[--grid-bg-color:#2727278c] ${
        expandedCell === 1
          ? "col-span-2 row-span-2 w-full h-full fixed top-0 left-0 z-50 scale-150"
          : ""
      }`}
          onClick={() => toggleExpand(1)}
        >
          <h1 className="text-2xl font-semibold">Most Popular Artists</h1>
          <WordCloud
            setSelectedArtists={setSelectedArtists}
            data={artistsRankings}
            width={850}
            height={300}
          />
        </div>

        {/* Heatmap */}
        <div
          className={`p-4 border rounded bg-[var(--grid-bg-color)] flex flex-col items-center overflow-auto 
      transition-all duration-300 ease-in-out cursor-pointer hover:[--grid-bg-color:#2727278c] ${
        expandedCell === 2
          ? "col-span-2 row-span-2 w-full h-full fixed top-0 left-0 z-50 scale-100"
          : ""
      }`}
          onClick={() => toggleExpand(2)}
        >
          <h1 className="text-2xl font-semibold">Popularity Over Time</h1>
          <HeatmapChart
            data={heatmapData.reverse()}
            width={expandedCell === 2 ? 1100 : 650}  // Increase width when expanded
            height={expandedCell === 2 ? 1600 : 800}
            selectedArtists={selectedArtists}
          />
        </div>

        {/* Radar Chart */}
        <div
          className={`p-4 border rounded bg-[var(--grid-bg-color)] flex flex-col justify-start items-center overflow-auto
      transition-all duration-300 ease-in-out cursor-pointer hover:[--grid-bg-color:#2727278c ] ${
        expandedCell === 3
          ? "col-span-2 row-span-2 w-full h-full fixed top-0 justify-center items-center left-0 z-50 scale-150 "
          : ""
      }`}
          onClick={() => toggleExpand(3)}
        >
          <h1 className="text-2xl font-semibold mb-2">Song Properties</h1>
          <Radarchart_explain isOpen={isPopupOpen} onClose={closePopup} />
          <div className="relative flex justify-center items-center w-full">
            <button
              className="absolute top-2 left-2 flex items-center justify-center w-10 h-10 bg-green-700 text-white rounded-full font-bold hover:bg-green-900"
              onClick={(event) => {
                event.stopPropagation();
                openPopup();}
                }
            >
              ?
            </button>
            <Radartest songsData={selectedSongs} />
          </div>
        </div>

        {/* Song List */}
        <div
          className={`p-4 border rounded bg-[var(--grid-bg-color)] overflow-auto 
      transition-all duration-300 ease-in-out `}
        >
          <SongList
            rankings={rankings}
            selectedArtists={selectedArtists}
            selectedSongs={selectedSongs}
            onSelectionChange={setSelectedSongs}
          />
        </div>
      </div>
    </div>
  );
}
