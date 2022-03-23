import { useState, useEffect } from "react";
import * as d3 from "d3";

export default function Choropleth(props) {
  const [topology, setTopology] = useState(null);

  const COUNTRY_TOPOLOGY_URL =
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

  useEffect(() => {
    const getTopology = async () => {
      const response = await fetch(COUNTRY_TOPOLOGY_URL);
      const data = await response.json();
      setTopology(data);
    };

    getTopology();
  });

  // Remove the old svg
  d3.select("#choropleth-container").select("svg").remove();

  let drawMap = () => {};
  return <div id="choropleth-container" />;
}
