"use client"; // Add this at the very top

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
import ParallelPlot from "./parallelPlot";
import Radarchart_explain from "@/components/radarchart-explain"

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
  const [colorMap, setColorMap] = useState<Record<string, { borderColor: string; backgroundColor: string }>>({});

  useEffect(() => {
    //console.log("Radartest received songs: ", songsData);
    if (!songsData || songsData.length === 0) {
      setData([]);
      return;
    }

    // Create a copy of the existing color map to persist colors
    const newColorMap = { ...colorMap };

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

    // Generate colors only for new songs
    uniqueData.forEach((song) => {
      if (!newColorMap[song.spotify_id]) {
        const borderColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)})`;
        newColorMap[song.spotify_id] = {
          borderColor,
          backgroundColor: borderColor.replace("rgb", "rgba").replace(")", ", 0.2)"),
        };
      }
    });

    // Store the updated color map
    setColorMap(newColorMap);

    // Format data for radar chart
    const formattedData = uniqueData.map((song) => ({
      label: song.name,
      data: [
        song.energy,
        song.danceability,
        song.valence,
        song.acousticness,
        song.popularity / 100,
        song.liveness,
      ],
      fill: true,
      backgroundColor: newColorMap[song.spotify_id].backgroundColor, // Persistent background color
      borderColor: newColorMap[song.spotify_id].borderColor, // Persistent line color
      pointBackgroundColor: newColorMap[song.spotify_id].borderColor, // Persistent corners color
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: newColorMap[song.spotify_id].borderColor,
    }));

    setData(formattedData);
  }, [songsData]); // Update chart when `songsData` changes

  if (songsData.length > 10) {
    return <ParallelPlot songsData={songsData} />;
  }

  const chartData = {
    labels: [
      "Energy",
      "Danceability",
      "Valence",
      "Acousticness",
      "Popularity",
      "Liveness",
    ],
    datasets: data,
  };



  return (
    <div className="text-center">
      {data.length === 0 ? (
        <p>Choose songs in Song List</p>


      ) : (
        <div className="w-[430px] h-[430px]"> {/* Enlarged Chart */}
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
                    color: "rgb(92, 92, 92)", // Grid lines color
                  },
                  angleLines: {
                    color: "grey", // Angle lines color
                  },
                  ticks: {
                    color: "white", // Labels (numbers) color
                  },
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: "white", // Legend text color
                  },
                },
              },
              
            }}
          />
        </div>
      )}
    </div>
  );
}
