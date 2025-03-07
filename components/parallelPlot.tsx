"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

type Song = {
  name: string;
  spotify_id: string;
  energy: number;
  danceability: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  [key: string]: any;
};

type ParallelPlotProps = {
  songsData: Song[];
  width?: number;
  height?: number;
};

const attributes = [
  "energy",
  "danceability",
  "valence",
  "acousticness",
  "instrumentalness",
  "liveness",
];

const generateDistinctColors = (numColors: number) => {
  const baseColors = [
    ...d3.schemeCategory10,  // 10 distinct colors
    ...d3.schemeSet3,        // 12 additional distinct colors
    ...d3.schemePaired,      // 12 more distinct colors
    ...d3.schemeTableau10,   // 10 more distinct colors
  ];

  // Shuffle colors to ensure similar colors are spaced apart
  const shuffledColors = [...baseColors].sort(() => Math.random() - 0.5);

  return shuffledColors.slice(0, numColors);
};

const ParallelPlot: React.FC<ParallelPlotProps> = ({
  songsData,
  width = 500,
  height = 300,
}) => {
  const [highlightedSong, setHighlightedSong] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Generate a color scale with highly distinct colors
  const [colorScale] = useState(() => {
    const colors = generateDistinctColors(50); // Get 50 visually distinct colors
    return d3.scaleOrdinal<number, string>().domain([...Array.from(Array(50).keys())]).range(colors);
  });
  

  useEffect(() => {
    drawParallelPlot(songsData, colorScale);
  }, [songsData, highlightedSong, width, height]);

  const drawParallelPlot = (data: Song[], colorScale: d3.ScaleOrdinal<number, string>) => {
    const margin = { top: 30, right: 20, bottom: 50, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint()
      .range([0, innerWidth])
      .domain(attributes)
      .padding(0.1);

    const y: { [key: string]: d3.ScaleLinear<number, number> } = {};
    attributes.forEach((attr) => {
      y[attr] = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0]);
    });

    // Draw axes
    g.selectAll(".axis")
      .data(attributes)
      .enter()
      .append("g")
      .attr("class", "axis")
      .attr("transform", (d) => `translate(${x(d)})`)
      .each(function (d) {
        d3.select(this).call(d3.axisLeft(y[d]));
      });

    // Draw lines
    g.selectAll(".line")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "line")
      .attr(
        "d",
        (d: Song) =>
          d3
            .line()(
              attributes.map((attr) => [x(attr) ?? 0, y[attr](d[attr]) ?? 0])
            )
      )
      .style("fill", "none")
      .style("stroke", (d, i) => colorScale(i % 50)) // Ensures color mapping within 50 colors
      .style(
        "stroke-width",
        (d, i) => (highlightedSong !== null && highlightedSong === i ? 3 : 1)
      );

    // Draw attribute labels
    g.selectAll(".label")
      .data(attributes)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d) ?? 0)
      .attr("y", innerHeight + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .text((d) => d);
  };

  const handleLegendClick = (index: number) => {
    setHighlightedSong((prev) => (prev === index ? null : index)); // Toggle selection
  };

  return (
    <div>
      <svg ref={svgRef}></svg>

      {/* Clickable Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px", cursor: "pointer" }}>
        {songsData.map((song, index) => (
          <div
            key={song.spotify_id}
            onClick={() => handleLegendClick(index)}
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "10px",
              padding: "5px",
              borderRadius: "5px",
              backgroundColor: highlightedSong === index ? "#ddd" : "transparent",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: colorScale(index % 50), // Uses more distinguishable colors
                marginRight: "5px",
              }}
            ></div>
            <span style={{ fontSize: "12px" }}>{song.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParallelPlot;
