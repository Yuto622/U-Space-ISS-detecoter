import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ISSPosition, Coordinates } from '../types';

interface WorldMapProps {
  issPosition: ISSPosition;
  userLocation?: Coordinates | null;
}

const WorldMap: React.FC<WorldMapProps> = ({ issPosition, userLocation }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = 300;
    const svg = d3.select(svgRef.current);
    
    // Clear previous
    svg.selectAll("*").remove();

    // Projection
    const projection = d3.geoEquirectangular()
      .scale(width / 6.3) // Adjust scale to fit
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Draw Globe Background
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#0f172a")
      .attr("rx", 16);

    // Draw Graticule (Grid)
    const graticule = d3.geoGraticule();
    svg.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.05)")
      .attr("stroke-width", 0.5);

    // 1. Draw User Location if available
    if (userLocation) {
        const userCoords: [number, number] = [userLocation.longitude, userLocation.latitude];
        const [ux, uy] = projection(userCoords) || [0, 0];
        
        // User Pulse Animation
        const pulseCircle = svg.append("circle")
          .attr("cx", ux)
          .attr("cy", uy)
          .attr("r", 3)
          .attr("fill", "#22c55e")
          .attr("opacity", 0.5);

        function repeatPulse() {
          pulseCircle
            .attr("r", 3)
            .attr("opacity", 0.5)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("r", 20)
            .attr("opacity", 0)
            .on("end", repeatPulse);
        }
        repeatPulse();

        // Solid User Dot
        svg.append("circle")
          .attr("cx", ux)
          .attr("cy", uy)
          .attr("r", 4)
          .attr("fill", "#22c55e") // Green for user
          .attr("stroke", "#fff")
          .attr("stroke-width", 1);

        // User Label
        svg.append("text")
           .attr("x", ux)
           .attr("y", uy - 12)
           .text("YOU")
           .attr("text-anchor", "middle")
           .attr("fill", "#22c55e")
           .attr("font-size", "10px")
           .attr("font-family", "monospace")
           .attr("font-weight", "bold");
    }

    // 2. Draw ISS
    const issCoords: [number, number] = [issPosition.longitude, issPosition.latitude];
    const [x, y] = projection(issCoords) || [0, 0];

    // ISS Ripple
    svg.append("circle")
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", 5)
      .attr("fill", "none")
      .attr("stroke", "#06b6d4")
      .attr("stroke-width", 2)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr("r", 30)
      .attr("opacity", 0)
      .on("end", function repeat() {
          d3.select(this)
            .attr("r", 5)
            .attr("opacity", 1)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("r", 30)
            .attr("opacity", 0)
            .on("end", repeat);
      });

    // The Satellite Icon
    svg.append("circle")
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", 4)
      .attr("fill", "#fff")
      .attr("filter", "drop-shadow(0 0 4px #06b6d4)");
    
  }, [issPosition, userLocation]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm">
      <svg ref={svgRef} className="w-full h-[300px]" style={{ display: 'block' }} />
    </div>
  );
};

export default WorldMap;