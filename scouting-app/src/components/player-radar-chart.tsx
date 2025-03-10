// Inspiration from https://dev.to/simbamkenya/building-spider-chart-with-d3-js-and-react-js-50pj
// and https://yangdanny97.github.io/blog/2019/03/01/D3-Spider-Chart

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { Player } from "../types/Player";
import { cleanDataRadar } from "../utils/data-cleaning";

interface PlayerRadarChartProps {
  player: Player;
}

const PlayerRadarChart: React.FC<PlayerRadarChartProps> = ({ player }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = React.useState({
    width: 400,
    height: 400,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        setDimensions({ width, height });
      }
    };
    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const { width, height } = dimensions;
    if (width === 0 || height === 0) return;

    const data = cleanDataRadar(player);

    const margin = 100;
    const radius = Math.min(width, height) / 2 - margin;
    const maxValue = 100;
    const numAxes = data.length;
    const angleSlice = (Math.PI * 2) / numAxes;
    const dynamicFontSize = Math.min(width, height) * 0.01;
    const dynamicFontSizeSub = Math.min(width, height) * 0.012;
    const dynamicFontSizeLabel = Math.min(width, height) * 0.013;

    // Scale mapping values to radial distance
    const rScale = d3.scaleLinear().domain([0, maxValue]).range([0, radius]);

    // Clear any previous SVG content
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();

    // Create the main group element and center it
    const svg = svgEl
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Draw concentric circles (grid lines)
    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      svg
        .append("circle")
        .attr("r", (radius / levels) * i)
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-dasharray", "2,2")
        .attr("stroke-width", 0.5);

      const labelX = ((radius / levels) * i + 10) * Math.cos(-Math.PI / 2.3);
      const labelY = ((radius / levels) * i + 5) * Math.sin(-Math.PI / 2.3);

      svg
        .append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("text-anchor", "middle")
        .attr("font-size", `${dynamicFontSizeSub}px`)
        .attr("font-family", "Arial")
        .attr("fill", "#666")
        .text(((maxValue / levels) * i).toFixed(0));
    }

    // Draw axes and labels for each metric
    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const xAxis = rScale(maxValue) * Math.cos(angle);
      const yAxis = rScale(maxValue) * Math.sin(angle);

      // Axis line
      svg
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", xAxis)
        .attr("y2", yAxis)
        .attr("stroke", "#999")
        .attr("stroke-width", 1);

      // Axis label (positioned beyond the outer grid circle)
      const labelX = rScale(maxValue) * 1.1 * Math.cos(angle);
      const labelY = rScale(maxValue) * 1.1 * Math.sin(angle);
      const rotate = (angle * 180) / Math.PI + 90;

      svg
        .append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("transform", `rotate(${rotate})`)
        .attr("transform-origin", `${labelX} ${labelY}`)
        .attr("text-anchor", "middle")
        .attr("font-size", `${dynamicFontSizeLabel}px`)
        .attr("font-family", "Arial")
        .attr("font-weight", "bold")
        .attr("fill", "#333")
        .text(d.axis);
    });

    // Add title
    svg
      .append("text")
      .attr("x", 0)
      .attr("y", `${radius * 1.22 * Math.sin(-Math.PI / 2.3)}`)
      .attr("text-anchor", "middle")
      .attr("font-size", `${dynamicFontSize * 2}px`)
      .attr("font-family", "Arial")
      .attr("font-weight", "bold")
      .attr("fill", "#333")
      .text(player.player_name + " - Percentiles");

    // Create a radial line generator for the radar area
    const radarLine = d3
      .lineRadial<{ axis: string; value: number }>()
      .angle((_, i) => i * angleSlice)
      .radius((d) => rScale(d.value))
      .curve(d3.curveLinearClosed);

    svg
      .append("path")
      .datum(data)
      .attr("d", radarLine)
      .attr("fill", "#10B981")
      .attr("stroke", "#10B981")
      .attr("stroke-width", 2)
      .attr("fill-opacity", 0.5);

    // Draw data points on the radar area
    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = rScale(d.value) * Math.cos(angle);
      const y = rScale(d.value) * Math.sin(angle);
      svg
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 4)
        .attr("fill", "#10B981");
    });

    // Add percentiles as text labels
    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = rScale(d.value) * 1.05 * Math.cos(angle);
      const y = rScale(d.value) * 1.05 * Math.sin(angle);
      const rotate = (angle * 180) / Math.PI + 90;
      svg
        .append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("font-size", `${dynamicFontSize}px`)
        .attr("font-family", "Arial")
        .attr("font-weight", "bold")
        .attr("transform", `rotate(${rotate})`)
        .attr("transform-origin", `${x} ${y}`)
        .attr("fill", "#333")
        .text(`${d.value}th`);
    });
  }, [player, dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg ref={svgRef} className="mx-auto w-full h-full" />
    </div>
  );
};

export default PlayerRadarChart;
