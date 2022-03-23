import { useState, useEffect } from "react";
import PieChart from "./pie";

export default function VotesByRegions(props) {
  const [refinedData, setRefinedData] = useState([]);
  const [fileSHA, setFileSHA] = useState(null);
  const [fileBlob, setFileBlob] = useState(null);

  const getFileSHA = async () => {
    const response = await fetch(
      "https://api.github.com/repos/hackernoon/where-startups-trend/contents/2021/"
    );
    const data = await response.json();
    setFileSHA(data[3].sha);

    fileSHA && getFileBlob();
  };

  const getFileBlob = async () => {
    const response = await fetch(
      `https://api.github.com/repos/hackernoon/where-startups-trend/git/blobs/${fileSHA}`
    );
    const data = await response.json();
    setFileBlob(data.content);

    fileBlob && convertBlob();
  };

  const convertBlob = async () => {
    const base64Data = await decodeUnicode(fileBlob);
    setRefinedData(base64Data);

    console.log(base64Data);
  };

  const decodeUnicode = (str) => {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(
      atob(str)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  };

  useEffect(() => {
    getFileSHA();
  }, []);

  return (
    <>
      hi
      <PieChart data={refinedData} />
    </>
  );
}
