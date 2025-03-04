"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type SeriesEntry = {x: string, y: number | null};

type Series = {
    name: string;
    data: SeriesEntry[];
  };

type HeatMapProps = {
    data: Series[];
    width?: number;
    height?: number;
  };

const HeatmapChart: React.FC<HeatMapProps> = ({ data, width=500, height=500 }) => {
  //const colors = chartData.map(() => getRandomColor());

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
        style: {
          colors: "#FFFFFF",
          fontSize: "11px",
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
    plotOptions: {
      heatmap: {
        radius: 0,
        shadeIntensity: 0.5,
        useFillColorAsStroke: true,
        distributed: false,
        colorScale: {
          inverse: true,
          min: 1,
          max: 50,
          ranges: [
            { from: 1, to: 10, color: "#1DB954" },
            { from: 11, to: 20, color: "#6FCC9B" },
            { from: 21, to: 30, color: "#A8E3BF" },
            { from: 31, to: 40, color: "#D4F1DF" },
            { from: 41, to: 50, color: "#FFFFFF" }, 
            { from: 51, to: 1000, color: "#FFFFFF" },
          ],
        },
      },
    },
  };
  
  
    /*
    plotOptions: {
        heatmap: {
            colorScale: {
                ranges: [
                    {from: 1, to: 10, color:"red"},
                    {from: 11, to: 30, color:"orange"},
                    {from: 31, to: 50, color:"yellow"},
                ],
            },
        },
    },
    colors: ["ff0000"],
    */

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
