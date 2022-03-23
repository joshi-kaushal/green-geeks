import React, { useEffect } from "react";
import * as d3 from "d3";
//https://stackoverflow.com/questions/30687703/d3-js-pie-chart-with-label
export default function PieChart(props) {
  const { data, outerRadius = 700, innerRadius = 0 } = props;

  const margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50,
  };

  const width = 2 * outerRadius + margin.left + margin.right;
  const height = 2 * outerRadius + margin.top + margin.bottom;

  const colorScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateRgb("#00FF00", "#0000EB"))
    .domain([0, data.length]);
  useEffect(() => {
    drawChart();
  }, [data]);

  function drawChart() {
    // Remove the old svg
    d3.select("#pie-container").select("svg").remove();

    // Create new svg
    const svg = d3
      .select("#pie-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const arcGenerator = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const pieGenerator = d3
      .pie()
      .padAngle(0)
      .value((d) => d.value);

    const arc = svg.selectAll().data(pieGenerator(data)).enter();

    // Append arcs
    arc
      .append("path")
      .attr("d", arcGenerator)
      .style("fill", (_, i) => colorScale(i))
      .style("stroke", "#ffffff")
      .style("stroke-width", 0);

    // Get the Angle on the arc and then rotate by -90degrees
    const getAngle = (d) => {
      return ((180 / Math.PI) * (d.startAngle + d.endAngle)) / 2 - 90;
    };

    // Append text labels
    arc
      .append("text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text((d) => d.data.label)
      .attr("transform", (d) => {
        const [x, y] = arcGenerator.centroid(d);
        return `translate(${x}, ${y}) rotate(${getAngle(d)})`;
      });
  }

  return <div id="pie-container" />;
}
