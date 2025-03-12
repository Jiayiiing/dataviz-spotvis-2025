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
  const [highlightedSong, setHighlightedSong] = useState<string | null>(null);

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
        let borderColor: string;
        
        // Keep generating a color until it's not white
        do {
          borderColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
          )}, ${Math.floor(Math.random() * 255)})`;
        } while (borderColor === 'rgb(255, 255, 255)'); // Check for white color
        
        newColorMap[song.spotify_id] = {
          borderColor,
          backgroundColor: borderColor.replace("rgb", "rgba").replace(")", ", 0.2)"), // Apply transparency
        };
      }
    });

    // Store the updated color map
    setColorMap(newColorMap);

    // Format data for radar chart
    const formattedData = uniqueData.map((song) => {
      const isHighlighted = song.spotify_id === highlightedSong; // Check if song is highlighted
      return {
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
        backgroundColor: isHighlighted 
        ? "white" // Set the background to white for the highlighted song
        : newColorMap[song.spotify_id].backgroundColor, 
      borderColor: isHighlighted ? "white" : newColorMap[song.spotify_id].borderColor, 
      borderWidth: isHighlighted ? 6 : 2, 
      pointBackgroundColor: isHighlighted ? "white" : newColorMap[song.spotify_id].borderColor, 
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: isHighlighted ? "white" : newColorMap[song.spotify_id].borderColor, 
      };
    });
    setData(formattedData);
  }, [songsData, highlightedSong]);

  if (songsData.length > 5) {
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

  const handleLegendClick = (songId: string) => {
    setHighlightedSong((prev) => (prev === songId ? null : songId)); 
  };

  return (
    <div className="text-center">
        {data.length === 0 ? (<p>Choose songs in Song List</p> ) : (
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
                  min: 0,
                  max: 1,
                  grid: {
                    color: "rgb(92, 92, 92)", // Grid lines color
                  },
                  angleLines: {
                    color: "grey", // Angle lines color
                  },
                  ticks: {
                    color: "white", // Labels (numbers) color
                    backdropColor: "transparent",
                  },
                  pointLabels: {
                    color: "white", // Change label color here
                    font: {
                      size: 12, // Adjust label size if needed
                      weight: "bold", // Make text bold
                    },
                  },
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: "white", // Legend text color
                  },
                  onClick: (e, legendItem, legend) => {
                    if (legendItem.datasetIndex !== undefined) {
                      const songId = songsData[legendItem.datasetIndex].spotify_id;
                      handleLegendClick(songId); 
                    }
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
