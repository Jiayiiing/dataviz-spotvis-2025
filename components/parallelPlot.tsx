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
  popularity: number;
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
  "popularity",
  "liveness",
];

const ParallelPlot: React.FC<ParallelPlotProps> = ({
  songsData,
  width = 500,
  height = 300,
}) => {
  const [highlightedSong, setHighlightedSong] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [colorMap, setColorMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const newColorMap = new Map(colorMap); // Preserve existing color map
    songsData.forEach((song) => {
      if (!newColorMap.has(song.spotify_id)) {
        // Generate a new color if it hasn't been assigned already
        const newColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)})`;
        newColorMap.set(song.spotify_id, newColor);
      }
    });
    setColorMap(newColorMap);
  }, [songsData]);

  useEffect(() => {
    drawParallelPlot(songsData, colorMap);
  }, [songsData, highlightedSong, width, height, colorMap]);

  const drawParallelPlot = (data: Song[], colorMap: Map<string, string>) => {
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

    const adjustedData = data.map((song) => ({
      ...song,
      popularity: song.popularity / 100, 
    }));

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
    .data(adjustedData)
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
      .style("stroke", (d) => colorMap.get(d.spotify_id) ?? "gray") // Use the persistent color from the colorMap
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
      .style("fill", "white")
      .text((d) => d);
  };

  const handleLegendClick = (index: number) => {
    setHighlightedSong((prev) => (prev === index ? null : index)); 
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
                backgroundColor: colorMap.get(song.spotify_id), 
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
