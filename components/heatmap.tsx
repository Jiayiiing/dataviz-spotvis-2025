"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type SeriesEntry = {x: string, y: number | null};
type Series = {
    name: string;
    data: SeriesEntry[];
  };

type Artist = { id: number, name: string };
type HeatMapProps = {
    data: Series[];
    width?: number;
    height?: number;
    selectedArtists: Artist[];
  };

const HeatmapChart: React.FC<HeatMapProps> = ({ data, width=500, height=1000, selectedArtists }) => {

  const [highlightedArtists, setHighlightedArtists] = useState(selectedArtists);

  useEffect(() => {
    setHighlightedArtists(selectedArtists);
  }, [selectedArtists]);

  const selectedNames = highlightedArtists.map(artist => artist.name);
  console.log("HIGHLIGHTED ARTISTS", selectedNames)

  // ApexCharts options
  const options: ApexCharts.ApexOptions = {
    chart: { type: "heatmap" },
    dataLabels: { enabled: false },
    xaxis: { 
      type: "category",
      labels: {
        style: {
          colors: "#FFFFFF", 
          fontSize: "11px", 
        }
      }
    },
    yaxis: {
      labels: {
        offsetY: 0,
        style: {
          colors: selectedNames.length > 0
            ? data.map(entry => selectedNames.includes(entry.name) ? "#A020F0" : "#FFFFFF") // Red color for selected artists
            : "#FFFFFF",  // Default color
          fontSize: "11px"
        }
      }
    },
    tooltip: { 
        enabled: true,
        followCursor: true,
        fillSeriesColor: true,
        style: {
            fontSize:"14px",
        },
        /*
        custom: function ({series, seriesIndex, dataPointIndex}) {
            const value = series[seriesIndex][dataPointIndex];
            return `<div style="padding: 5px; border-radius: 5px;"> <span style="color: black; font-weight: bold;">${value}</span> </div>`
        },
        */
    },
    stroke: {
      //colors: selectedNames.length > 0 ? data.map(entry => selectedNames.includes(entry.name) ? ["#A020F0"] : ["#FFFFFF"]) : ["#FFFFFF"],
      show: true,
    },
    annotations: {
      yaxis: selectedNames.length > 0
        ? selectedNames.map(name => {
            const entryIndex = data.findIndex(entry => entry.name === name);
  
            if (entryIndex !== -1) {
              return {
                y: entryIndex,  // Row corresponding to selected name
                stroke: {
                  color: "#A020F0",  // Stroke (border) color for the selected row
                  width: 3,  // Stroke width for the selected row
                }
              };
            }
            return null;
          }).filter(Boolean) // Filters out any null values
        : [],
    },
    plotOptions: {
      heatmap: {
        radius: 5,
        shadeIntensity: 0.75,
        useFillColorAsStroke: false,
        distributed: false,
        colorScale: {
          inverse: false,
          min: 1,
          max: 50,
          ranges: [
            { from: 1, to: 10, color: "#1DB954" },  // Spotify green (top)
            { from: 11, to: 20, color: "#6FCC9B" }, // Light green
            { from: 21, to: 30, color: "#FFB300" }, // Yellow (middle)
            { from: 31, to: 40, color: "#FFA726" }, // Orange
            { from: 41, to: 50, color: "#FF0000" }, // Red (bottom)
            { from: null, to: null, color: "#000000", name: "Outside top 50"},
          ],
        },
      },
    },
  };
  

if (!data || data.length === 0) {
    return <p>Loading heatmap data...</p>;
    }

  return (
    <div>
        <Chart options={options} series={data} type="heatmap" height={height} width={width} />
    </div>
  );
};

export default HeatmapChart;
