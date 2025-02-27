"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Radius } from "lucide-react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });


/*
const getColorByRank = (rank: number) => {
    const baseColor = [255, 50, 50]; // Red base (R, G, B)
    const intensity = 255; // Normalize intensity (1 for rank 1, ~0 for rank 50)
    return `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${intensity})`;
  };
*/


const getColorByRank = (rank: number | null) => {
    if (rank === null) return "white"; // Missing data = white
    if (rank <= 10) return "red";
    if (rank <= 30) return "orange";
    return "yellow";
  };


const HeatmapChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const countryId = searchParams.get('countryId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
            `/api/heatmap?country=${countryId}&startDate=2024-02-19&endDate=2024-02-25`
          );
        const rawData = await res.json();

        const artistMap = new Map();
        const allDates = new Set(rawData.map(({ snapshot_date }: any) => snapshot_date));

        rawData.forEach(({ artist_name, snapshot_date, daily_rank }: any) => {
            if (!artistMap.has(artist_name)) {
                artistMap.set(artist_name, new Map());
            }
            artistMap.get(artist_name).set(snapshot_date, daily_rank);
        });

        const formatedData = Array.from(artistMap, ([artist, rankMap]) => ({
            name: artist,
            data: Array.from(allDates, (date) => ({
                x: date as any,
                y: rankMap.get(date) ?? null,
            })),
        }));

        setChartData(formatedData as any);
        console.log("Formatted Heatmap Data:", formatedData);
        
      } catch (error) {
        console.error("Error fetching heatmap data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [countryId]);

  //const colors = chartData.map(() => getRandomColor());

  // ApexCharts options
  const options: ApexCharts.ApexOptions = {
    chart: { type: "heatmap" }, // explicitly use "heatmap"
    dataLabels: { enabled: false },
    xaxis: { type: "category" },
    tooltip: { enabled: true },
    plotOptions: {
      heatmap: {
        radius: 1,
        shadeIntensity: 0.5,
        useFillColorAsStroke: false,
        distributed: false,
        colorScale: {
          inverse: true,
          min: 1,
          max: 50,
          ranges: [
            { from: 1, to: 10, color: "#FF0000" }, // Bright red
            { from: 11, to: 20, color: "#FF4444" }, // Slightly lighter red
            { from: 21, to: 30, color: "#FF8888" }, // Medium light red
            { from: 31, to: 40, color: "#FFBBBB" }, // Even lighter red
            { from: 41, to: 50, color: "#FFE5E5" }, // Almost white
            { from: 51, to: 1000, color: "#FFFFFF" }, // Pure white for missing values
            //{ from: null, to: null, color: "#FFFFFF" }, // Make explicit nulls white
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


  return (
    <div>
      {loading ? <p>Loading heatmap...</p> : <Chart options={options} series={chartData} type="heatmap" height={600} />}
    </div>
  );
};

export default HeatmapChart;
