"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type SeriesEntry = {x: string, y: number | null};
type Series = {
    name: string;
    data: SeriesEntry[];
  };

type Artist = { name: string };
type HeatMapProps = {
    data: Series[];
    width?: number;
    height?: number;
    selectedArtists: Artist[];
  };

const HeatmapChart: React.FC<HeatMapProps> = ({ data, width, height, selectedArtists }) => {

  const [highlightedArtists, setHighlightedArtists] = useState(selectedArtists);

  //console.log("THE data", data)

  useEffect(() => {
    setHighlightedArtists(selectedArtists);
  }, [selectedArtists]);

  const selectedNames = highlightedArtists.map(artist => artist.name.trim());
  console.log("HIGHLIGHTED ARTISTS", selectedNames)

  const reorderedData = [
    ...data.filter(entry => !selectedNames.includes(entry.name.trim())),
    ...data.filter(entry => selectedNames.includes(entry.name.trim())) 
  ];
  

  // ApexCharts options
  const options: ApexCharts.ApexOptions = {
    chart: { type: "heatmap", toolbar: { show: false } },
    dataLabels: { enabled: false },
    xaxis: { 
      type: "category",
      tooltip: { enabled: false },
      labels: {
        style: {
          colors: "#FFFFFF", 
          fontSize: "11px",
          fontWeight: "bold",
        }
      }
    },
    yaxis: {
      labels: {
        offsetY: 0,
        style: {
          colors: selectedNames.length > 0
            ? reorderedData.map(entry => selectedNames.includes(entry.name.trim()) ? "#fff59f" : "#FFFFFF") // Red color for selected artists
            : "#FFFFFF",  // Default color
          fontSize: "11px",
          fontWeight: "bold",
        }
      }
    },
    tooltip: { 
        enabled: true,
        followCursor: true,
        fillSeriesColor: true,
        y: {
          formatter: function (value, { seriesIndex, dataPointIndex, w }) {
            const xvalue = w.globals.labels[dataPointIndex];
            return `Date: ${xvalue}<br>Rank: ${value}`;
          }
        },
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
    legend: {
      position: "right",
    },
    /*
    annotations: {
      yaxis: reorderedData
        .filter(entry => selectedNames.includes(entry.name)) // Find where selected names exist
        .map(entry => ({
          y: entry.name,       // Place annotation at this y-value
          borderColor: "#fff59f",  // Border color (change if needed)
          borderWidth: 20,
          strokeDashArray: 0,
          opacity: 1,
        })),
    },
    */
    plotOptions: {
      heatmap: {
        radius: 4,
        shadeIntensity: 0.7,
        useFillColorAsStroke: false,
        distributed: false,
        colorScale: {
          inverse: false,
          min: 1,
          max: 50,
          ranges: [
            //{ from: 1, to: 50, color: "#1DB954" },  // Green for top-ranked
            { from: 1, to: 1, color: "#00FFFF", name: "Top of the charts" },
            { from: 2, to: 15, color: "#1DB954" },  // Green for top-ranked
            { from: 16, to: 35, color: "#FFB300" }, // Yellow/Orange for mid-ranked
            { from: 36, to: 50, color: "#FF0000" }, // Red for lower ranks
            { from: 0, to: 0, color: "#000000", name: "Outside top 50"},
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
        <Chart options={options} series={reorderedData} type="heatmap" height={height} width={width} />
    </div>
  );
};

export default HeatmapChart;
