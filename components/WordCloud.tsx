"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

type Word = {
  text: string;
  value: number;
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

    const displaySelection = svg
      .append("text")
      .attr("font-family", "Lucida Console, Courier, monospace")
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "hanging")
      .attr("x", 10)
      .attr("y", 10);

    const scaleSize = d3
      .scaleSqrt()
      .domain([1, d3.max(data.map((d) => d.value)) || 1])
      .range([12, 82]);

    const layout = cloud<Word>()
      .size([width, height])
      .words(data.map((d) => ({ ...d })))
      .padding(2) // adjust these two for styling
      .rotate(() => 0)
      .font(fontFamily)
      .fontSize((d) => scaleSize(d.value))
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
            d3.select(this)
              .attr("font-weight", "bold")
              .attr("font-size", (d) => scaleSize((d as Word).value + 1));
          })
          .on("mouseout", function () {
            d3.select(this)
              .attr("font-weight", "normal")
              .attr("font-size", (d) => scaleSize((d as Word).value));
          })
          .on("click", function (event, d) {
            console.log(d.text);
            //displaySelection.text(`selection="${d.text}"`);
            d3.select(this).classed("word-selected", !d3.select(this).classed("word-selected"));
          });
      });

    layout.start();
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default WordCloud;
