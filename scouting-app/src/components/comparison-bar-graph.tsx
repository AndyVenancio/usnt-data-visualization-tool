// Inspired by youtube tutorials and documentation
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { Player } from "../types/Player";
import { cleanDataComparison } from "../utils/data-cleaning";

interface PlayerComparisonChartProps {
  players: Player[];
}

const ComparisonBarChart: React.FC<PlayerComparisonChartProps> = ({ players }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // Data cleaning and validation
    if (players.length !== 2) {
      console.error("Comparison chart requires exactly two players.");
      return;
    }
    if (!players.every((player) => player)) {
      console.error("One or more players are undefined.");
      return;
    }
    const cleanedData = cleanDataComparison(players);
    const player1Data = cleanedData[0];
    const player2Data = cleanedData[1];

    // Create a union of stat keys
    const allStats = Array.from(
      new Set([
        ...player1Data.stats.map((s) => s.key),
        ...player2Data.stats.map((s) => s.key),
      ])
    );

    // Merge the data by stat
    const mergedData = allStats.map((stat) => {
      const p1Stat = player1Data.stats.find((s) => s.key === stat);
      const p2Stat = player2Data.stats.find((s) => s.key === stat);
      return {
        stat,
        [player1Data.player_name]: p1Stat ? p1Stat.value : 0,
        [player2Data.player_name]: p2Stat ? p2Stat.value : 0,
      };
    });

    // Chart dimensions
    const margin = { top: 60, right: 30, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400; // Fixed height for vertical bar chart

    // Create x-scale (categorical) for stat names
    const xScale = d3
      .scaleBand()
      .domain(mergedData.map((d) => d.stat))
      .range([0, width])
      .padding(0.2);

    // Create a sub-scale for each player within a stat group (for grouped bars)
    const subgroups = [player1Data.player_name, player2Data.player_name];
    const xSubScale = d3
      .scaleBand()
      .domain(subgroups)
      .range([0, xScale.bandwidth()])
      .padding(0.1);

    // Create y-scale (linear) for values; bars grow upward
    const yMax =
      d3.max(mergedData, (d) =>
        Math.max(d[player1Data.player_name], d[player2Data.player_name])
      ) || 0;
    const yScale = d3.scaleLinear().domain([0, yMax]).range([height, 0]);

    // Define colors for players
    const colors: { [key: string]: string } = {
      [player1Data.player_name]: "#10B981", // Emerald-500
      [player2Data.player_name]: "#6366F1",  // Indigo-500
    };

    // Clear previous SVG content
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();

    // Create responsive SVG container with viewBox and margins
    const svg = svgEl
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom + 100
        }`
      )
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Draw x-axis with rotated labels
    svg
      .append("g")
      .attr("transform", `translate(0, ${height + 10})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("text-anchor", "end")
      .attr("font-size", "8px")
      .attr("fill", "#333")
      .attr("transform", "rotate(-25)");

    // Draw y-axis on the left
    svg
      .append("g")
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll("text")
      .attr("font-size", "10px")
      .attr("fill", "#333");

    // Y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("font-family", "Arial, sans-serif")
      .attr("font-weight", "bold")
      .attr("font-size", "10px")
      .attr("fill", "#333")
      .text("Stats (per 90)");

    // Draw grouped vertical bars
    svg
      .selectAll("g.bar-group")
      .data(mergedData)
      .enter()
      .append("g")
      .attr("class", "bar-group")
      .attr("transform", (d) => `translate(${xScale(d.stat)}, 0)`)
      .each(function (d) {
        const group = d3.select(this);
        subgroups.forEach((sub) => {
          // Draw the bar for each player
          group
            .append("rect")
            .attr("x", () => xSubScale(sub)!)
            .attr("y", () => yScale(d[sub] as number))
            .attr("width", () => xSubScale.bandwidth())
            .attr("height", () => height - yScale(d[sub] as number))
            .attr("fill", colors[sub]);

          // Add value labels above each bar
          group
            .append("text")
            .attr("x", () => xSubScale(sub)! + xSubScale.bandwidth() / 2)
            .attr("y", () => yScale(d[sub] as number) - 5)
            .attr("text-anchor", "middle")
            .attr("font-size", "8px")
            .attr("fill", "#333")
            .text((d[sub] as number).toFixed(2));
        });
      });

    // Legend
    const legend = svgEl
      .append("g")
      .attr("transform", `translate(${width + margin.left - 180}, 60)`);

    subgroups.forEach((sub, i) => {
      const legendRow = legend
        .append("g")
        .attr("transform", `translate(${i * 100}, 0)`);
      legendRow
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", colors[sub]);
      legendRow
        .append("text")
        .attr("x", 20)
        .attr("y", 12)
        .attr("text-anchor", "start")
        .attr("font-size", "10px")
        .attr("fill", "#333")
        .text(sub);
    });

    // Title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .attr("font-size", "15px")
      .attr("font-weight", "bold")
      .attr("font-family", "Arial, sans-serif")
      .attr("fill", "#333")
      .text(
        `${player1Data.player_name} vs. ${player2Data.player_name} - Raw Statistics`
      );
  }, [players]);

  return <svg ref={svgRef} className="w-full h-auto" />;
};

export default ComparisonBarChart;

