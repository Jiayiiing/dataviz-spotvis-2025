"use client"; // Add this at the very top

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary chart components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function Radartest({ songsData }: { songsData: any[] }) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    console.log("Radartest received songs: ", songsData)
    if (!songsData || songsData.length === 0) {
      setData([]);
      return;
    }

    // Remove duplicates by `spotify_id`
    const uniqueData = Object.values(
      songsData.reduce<Record<string, (typeof songsData)[number]>>(
        (acc, song) => {
          acc[song.spotify_id] = song;
          return acc;
        },
        {}
      )
    );

    // Format data for radar chart
    const formattedData = uniqueData.map((song) => ({
      label: song.name,
      data: [
        song.energy,
        song.danceability,
        song.valence,
        song.acousticness,
        song.instrumentalness,
        song.liveness,
      ],
      fill: true,
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
      borderColor: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
      pointBackgroundColor: "rgb(255, 99, 132)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(255, 99, 132)",
    }));

    setData(formattedData);
  }, [songsData]); // Update chart when `songsData` changes

  const chartData = {
    labels: [
      "Energy",
      "Danceability",
      "Valence",
      "Acousticness",
      "Instrumentalness",
      "Liveness",
    ],
    datasets: data,
  };

  return (
    <div>
      {data.length === 0 ? (
        <p>No data available</p>
      ) : (
        <Radar
          data={chartData}
          options={{
            elements: {
              line: {
                borderWidth: 3, // Adjusts line thickness
              },
            },
            scales: {
              r: {
                grid: {
                  color: "rgba(145, 127, 127, 0.3)", // Grid lines color
                },
                angleLines: {
                  color: "white", // Angle lines color
                },
                ticks: {
                  color: "white", // Labels (numbers) color
                },
              },
            },
          }}
        />
      )}
    </div>
  );
}
