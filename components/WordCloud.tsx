"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

type Word = {
  text: string;
  value: number;
  id: number;
  x?: number;
  y?: number;
  rotate?: number;
};

type WordCloudProps = {
  data: Word[];
  width?: number;
  height?: number;
};

const WordCloud: React.FC<WordCloudProps> = ({ data, width = 500, height = 300 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const fontFamily = "Verdana, Arial, Helvetica, sans-serif";
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("font-family", fontFamily)
      .attr("text-anchor", "middle");

    svg.selectAll("*").remove();

    const minFontSize = 10;
    const maxFontSize = 60;

    const scaleSize = d3
      .scaleLinear()
      .domain([1, d3.max(data.map((d) => d.value)) || 1])
      .range([minFontSize, maxFontSize]);

    // Sort words by value (largest first)
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    // Use a fixed random seed so words always appear in the same position
    const randomGenerator = d3.randomLcg(0.5); // Fixed seed

    const layout = cloud<Word>()
      .size([width, height])
      .words(sortedData.map((d) => ({ ...d })))
      .padding(2)
      .rotate(() => 0) // No rotation for stability
      .font(fontFamily)
      .fontSize((d) => scaleSize(d.value))
      .spiral("rectangular") // More structured layout
      .random(() => randomGenerator()) // Ensures consistency
      .on("end", (words) => {
        svg
          .selectAll("text.word")
          .data(words)
          .enter()
          .append("text")
          .attr("class", "word click-only-text word-default")
          .attr("font-size", (d) => scaleSize(d.value))
          .attr("transform", (d) => `translate(${(d.x ?? 0) + width / 2},${(d.y ?? 0) + height / 2}) rotate(${d.rotate ?? 0})`)
          .text((d) => d.text)
          .on("mouseover", function () {
            const currentSize = scaleSize((d3.select(this).datum() as Word).value);
            const increase = (maxFontSize - minFontSize) * 0.02; // Fixed amount based on scale
            d3.select(this)
              .attr("font-weight", "bold")
              .transition()
              .duration(200)
              .attr("font-size", currentSize + increase);
          })
          .on("mouseout", function () {
            d3.select(this)
              .attr("font-weight", "normal")
              .transition()
              .duration(200)
              .attr("font-size", (d) => scaleSize((d as Word).value));
          })
          .on("click", function (event, d) {
            console.log(d.text);
            console.log(d.id)
            d3.select(this).classed("word-selected", !d3.select(this).classed("word-selected"));
          });
      });

    layout.start();
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default WordCloud;
