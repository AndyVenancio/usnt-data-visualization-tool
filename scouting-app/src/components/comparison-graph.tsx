// Inspired by https://d3-graph-gallery.com/graph/barplot_horizontal.html and youtube tutorials
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { Player } from "../types/Player";
import { cleanDataComparison } from "../utils/data-cleaning";

interface PlayerComparisonChartProps {
  players: Player[];
}

const ComparisonBarChart: React.FC<PlayerComparisonChartProps> = ({
  players,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // Data Cleaning, get the data for the comparison chart
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

    const allStats = Array.from(
      new Set([
        ...player1Data.stats.map((s) => s.key),
        ...player2Data.stats.map((s) => s.key),
      ])
    );

    const mergedData = allStats.map((stat) => { // Merge the data for the two players
      const p1Stat = player1Data.stats.find((s) => s.key === stat);
      const p2Stat = player2Data.stats.find((s) => s.key === stat);
      return {
        stat,
        [player1Data.player_name]: p1Stat ? p1Stat.value : 0,
        [player2Data.player_name]: p2Stat ? p2Stat.value : 0,
      };
    });

    // Chart Dimensions
    const margin = { top: 60, right: 30, bottom: 40, left: 120 };
    const width = 800 - margin.left - margin.right;
    const height = mergedData.length * 30;

    // Create x-scale (values) and y-scale (stat names)
    const xMax =
      d3.max(mergedData, (d) =>
        Math.max(d[player1Data.player_name], d[player2Data.player_name])
      ) || 0;
    const xScale = d3.scaleLinear().domain([0, xMax]).range([0, width]);

    const yScale = d3
      .scaleBand()
      .domain(mergedData.map((d) => d.stat))
      .range([0, height])
      .padding(0.2);

    // For grouped bars: create a sub-scale for each player within a stat group
    const subgroups = [player1Data.player_name, player2Data.player_name];
    const ySubScale = d3
      .scaleBand()
      .domain(subgroups)
      .range([0, yScale.bandwidth()])
      .padding(0.1);

    const colors: { [key: string]: string } = {
      [player1Data.player_name]: "#10B981", 
      [player2Data.player_name]: "#6366F1",
    };

    // Clear Previous
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();

    // Making the SVG responsive
    const svg = svgEl
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      )
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Draw the x-axis ticks
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(5));

    // Draw the y-axis ticks and label
    svg.append("g").call(d3.axisLeft(yScale))
        .selectAll("text")
        .attr("x", -8) 
        .attr("y", -5)
        .attr("dy", "0.35em") 
        .attr("transform", "rotate(-25)") 
        .attr("text-anchor", "end") 
        .attr("font-size", "8px") 
        .attr("fill", "#333"); 

    svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -height / 2 - 40)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("font-family", "Arial, sans-serif")
        .attr("font-weight", "bold")
        .attr("font-size", "10px")
        .attr("fill", "#333")
        .text("Stats (per 90)");

    // Draw grouped horizontal bars
    svg
      .selectAll("g.bar-group")
      .data(mergedData)
      .enter()
      .append("g")
      .attr("class", "bar-group")
      .attr("transform", (d) => `translate(0, ${yScale(d.stat)})`)
      .each(function (d) {
        const group = d3.select(this);
        subgroups.forEach((sub) => {
          group
            .append("rect")
            .attr("x", 0)
            .attr("y", () => ySubScale(sub)!)
            .attr("width", () => xScale(d[sub] as number))
            .attr("height", ySubScale.bandwidth())
            .attr("fill", colors[sub]);

            group
            .append("text")
            .attr("x", () => xScale(d[sub] as number) + 5)
            .attr("y", () => ySubScale(sub)! + ySubScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "start")
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
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .attr("font-size", "15px")
      .attr("font-weight", "bold")
      .attr("font-family", "Arial, sans-serif")
      .attr("fill", "#333")
      .text(
        `Comparison of ${player1Data.player_name} and ${player2Data.player_name} for ${players[0].season_name} and ${players[1].season_name} seasons`
      );
  }, [players]);

  return <svg ref={svgRef} className="w-full h-auto" />;
};

export default ComparisonBarChart;
