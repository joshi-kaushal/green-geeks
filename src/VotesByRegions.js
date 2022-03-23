import { useState, useEffect, useCallback } from "react";
// import { regions } from "./regions";
import PieChart from "./pie";

export default function VotesByRegions(props) {
  const [refinedData, setRefinedData] = useState([]);
  const [fileSHA, setFileSHA] = useState(null);
  const [fileBlob, setFileBlob] = useState(null);
  const [decodedBlob, setDecodedBlob] = useState(null);

  // const decodeUnicode = useCallback((str) => {
  //   // Going backwards: from bytestream, to percent-encoding, to original string.
  //   return decodeURIComponent(
  //     atob(str)
  //       .split("")
  //       .map(function (c) {
  //         return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
  //       })
  //       .join("")
  //   );
  // }, []);

  const getFileSHA = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.github.com/repos/hackernoon/where-startups-trend/contents/2021/"
      );
      const data = await response.json();
      console.log(data);
      setFileSHA(data[3].sha);

      fileSHA && getFileBlob();
    } catch (error) {
      console.log(error);
    }
  }, [fileSHA]);

  useEffect(() => {
    getFileSHA();
  }, [getFileSHA]);

  const getFileBlob = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/hackernoon/where-startups-trend/git/blobs/${fileSHA}`
      );
      const data = await response.json();
      setFileBlob(data.content);
      setDecodedBlob(atob(fileBlob));
      console.log(decodedBlob);
      createPieData(decodedBlob);
      // const base64Data = decodeUnicode(fileBlob);
      // setRefinedData(base64Data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  function createPieData(regions) {
    console.log(regions);

    regions.votesByRegion.forEach((region) => {
      const { region: label, votes: value } = region;

      const data = {
        label,
        value,
      };

      setRefinedData((refinedData) => [...refinedData, data]);
    });
  }

  useEffect(() => {
    createPieData();
  }, []);
  return (
    <>
      <h2>VotesByRegions</h2>
      <PieChart data={refinedData} />
    </>
  );
}
