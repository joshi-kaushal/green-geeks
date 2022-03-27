import { useState, useEffect, useCallback, memo, useMemo } from "react";
import PieChart from "./PieChart";
import PieChartLegend from "./PieChartLegend";

function VotesByRegions(props) {
  const [refinedData, setRefinedData] = useState([]);
  const [fileSHA, setFileSHA] = useState(
    "9705d417f8d433796b7e51f1239a620030060cbf"
  );
  const [fileBlob, setFileBlob] = useState("");

  const getFileSHA = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.github.com/repos/hackernoon/where-startups-trend/contents/2021/"
      );
      const data = await response.json();
      setFileSHA(data[3].sha);

      fileSHA && getFileBlob();
    } catch (error) {
      console.log(error);
    }
  }, [fileSHA]);

  const getFileBlob = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/hackernoon/where-startups-trend/git/blobs/${fileSHA}`
      );
      const data = await response.json();
      console.log(data);
      setFileBlob(data.content);

      // converts the base64 encoded blob into plain string
      // then JSON.parse() it to get the array of objects
      try {
        // atob() is not working
        let base64ToString = Buffer.from(fileBlob, "base64").toString();
        base64ToString = JSON.parse(base64ToString);
        createPieData(base64ToString);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }, [fileBlob]);

  const createPieData = (regions) => {
    regions.votesByRegion.forEach((region) => {
      const { region: label, votes: value } = region;

      // creates a new object with just label and value
      const data = {
        label,
        value,
      };
      setRefinedData((refinedData) => [...refinedData, data]);
    });
  };

  useEffect(() => {
    // getFileSHA();
    // I already have the file SHA, many API requests may lead to blocking
    getFileBlob();
  }, [getFileBlob]);

  return (
    <>
      <h1>Votes by Regions</h1>
      {/* {refinedData && <PieChart data={refinedData} />} */}
      {refinedData && <PieChartLegend data={refinedData} />}
    </>
  );
}

export default memo(VotesByRegions);
