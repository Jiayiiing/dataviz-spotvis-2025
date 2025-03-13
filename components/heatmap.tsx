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
      labels: {
        colors: "#FFFFFF",
      },
    },
    plotOptions: {
      heatmap: {
        radius: 2.5,
        shadeIntensity: 0.75,
        useFillColorAsStroke: false,
        distributed: false,
        colorScale: {
          inverse: false,
          min: 1,
          max: 50,
          ranges: [
            { from: 1, to: 11, color: "#008000", name: "1 - 10" }, 
            { from: 11, to: 26, color: "#FFB300", name: "11 - 25" },
            { from: 26, to: 50, color: "#FF0000", name: "26 - 50" },
            { from: 0, to: 0, color: "#2E2E2E", name: "Not in top 50" },
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
