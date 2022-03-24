import { useState, useEffect, useCallback } from "react";
// import { regions } from "./regions";
import PieChart from "./pie";

export default function VotesByRegions(props) {
  const [refinedData, setRefinedData] = useState([]);
  const [fileSHA, setFileSHA] = useState(null);
  const [fileBlob, setFileBlob] = useState(null);
  const [decodedBlob, setDecodedBlob] = useState(null);

  const decodeUnicode = useCallback((str) => {
    const fr = new FileReader();

    fr.onload = (e) => {
      console.log(JSON.parse(e.target.result));
    };

    return fr.readAsText(str);
  }, []);

  const getFileSHA = useCallback(async () => {
    try {
      // const response = await fetch(
      //   "https://api.github.com/repos/hackernoon/where-startups-trend/contents/2021/"
      // );
      // const data = await response.json();
      // setFileSHA(data[3].sha);
      setFileSHA("9705d417f8d433796b7e51f1239a620030060cbf");
      // console.log(fileSHA);

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
        `https://api.github.com/repos/hackernoon/where-startups-trend/git/blobs/9705d417f8d433796b7e51f1239a620030060cbf`
      );
      const data = await response.json();
      console.log(data.sha);

      setFileBlob(data.content);
      console.log(fileBlob);

      try {
        let base64ToString = Buffer.from(fileBlob, "base64").toString();
        base64ToString = JSON.parse(base64ToString);
        console.log(base64ToString);
        createPieData(base64ToString);
      } catch (error) {
        console.log(error);
      }
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
    getFileBlob();
  }, []);
  return (
    <>
      <h2>VotesByRegions</h2>
      {/* <p>File SHA: {fileSHA}</p>
      <p>File Blob: {fileBlob}</p>
      <p>Decoded Blob: {typeof decodedBlob}</p> */}
      <PieChart data={refinedData} />
    </>
  );
}
