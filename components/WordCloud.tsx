"use client";

import React, { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

type Word = {
  text: string;
  value: number;
  x?: number;
  y?: number;
  rotate?: number;
};

type Artist = { name: string };

type WordCloudProps = {
  data: Word[];
  setSelectedArtists: React.Dispatch<React.SetStateAction<Artist[]>>;
  width?: number;
  height?: number;
};

const WordCloud: React.FC<WordCloudProps> = ({ setSelectedArtists, data, width = 500, height = 300 }) => {
  const selectedArtistsRef = useRef<Set<string>>(new Set());
  const wordColorMap = useRef<Map<string, string>>(new Map());

  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleClick = useCallback((event: any, d: Word) => {
    const wordKey = d.text;
    const isSelected = selectedArtistsRef.current.has(wordKey);

    if (isSelected) {
      selectedArtistsRef.current.delete(wordKey);
      d3.select(event.target).classed("word-selected", false);
    } else {
      selectedArtistsRef.current.add(wordKey);
      d3.select(event.target).classed("word-selected", true);
    }

    setSelectedArtists((prevSelected) =>
      isSelected ? prevSelected.filter((a) => a.name !== wordKey) : [...prevSelected, { name: wordKey }]
    );
  }, [setSelectedArtists]);

  useEffect(() => {
    if (!svgRef.current) return;

    const fontFamily = "Verdana, Arial, Helvetica, sans-serif";
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("font-family", fontFamily)
      .attr("text-anchor", "middle");

    svg.selectAll("text.word").remove();

    const minFontSize = 10;
    const maxFontSize = 60;

    const scaleSize = d3
      .scaleLinear()
      .domain([1, d3.max(data.map((d) => d.value)) || 1])
      .range([minFontSize, maxFontSize]);

    const colorScale = d3.scaleSequential()
    .domain([0, 1]) // Random range for slight changes
    .interpolator(d3.interpolateRgb(d3.rgb(29,185,84), d3.rgb(126, 233, 105))); 

    // Sort words by value (largest first)
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    // Use a fixed random seed so words always appear in the same position
    const randomGenerator = d3.randomLcg(0.5);

    sortedData.forEach((word) => {
      if (!wordColorMap.current.has(word.text)) {
        wordColorMap.current.set(word.text, colorScale(Math.random()));
      }
    });

    const layout = cloud<Word>()
      .size([width, height])
      .words(sortedData.map((d) => ({ ...d })))
      .padding(1)
      .rotate(() => 0)
      .font(fontFamily)
      .fontSize((d) => scaleSize(d.value))
      .spiral("rectangular")
      .random(() => randomGenerator())
      .on("end", (words) => {
        const text = svg
          .selectAll("text.word")
          .data(words)
          .enter()
          .append("text")
          .attr("class", (d) => `word click-only-text word-default word-${d.text.replace(/\s+/g, "-").toLowerCase()}`)
          .attr("font-size", (d) => scaleSize(d.value))
          .attr("fill", (d) => wordColorMap.current.get(d.text)!)
          .attr("transform", (d) => `translate(${(d.x ?? 0) + width / 2},${(d.y ?? 0) + height / 2}) rotate(${d.rotate ?? 0})`)
          .text((d) => d.text).on("mouseover", function () {
            const currentSize = scaleSize((d3.select(this).datum() as Word).value);
            const increase = (maxFontSize - minFontSize) * 0.05; // Fixed amount based on scale
            d3.select(this)
              .transition()
              .duration(200)
              .attr("font-size", currentSize + increase);
          })
          .on("mouseout", function () {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("font-size", (d) => scaleSize((d as Word).value));
          })
          .on("click", handleClick);

        text.each(function (d) {
          if (selectedArtistsRef.current.has(d.text)) {
            d3.select(this).classed("word-selected", true);
          }
        });
      });

    layout.start();
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default WordCloud;
