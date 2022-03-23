import { useState, useEffect } from "react";
import PieChart from "./pie";

export default function VotesByStartup(props) {
  const [refinedData, setRefinedData] = useState([]);

  const createPieData = (votesByStartup) => {
    votesByStartup.forEach((obj) => {
      delete obj.region;
      delete obj.description;
      delete obj.url;
      delete obj.city;

      obj["label"] = obj["name"];
      obj["value"] = obj["votes"];

      delete obj.name;
      delete obj.votes;

      setRefinedData((refinedData) => [...refinedData, obj]);
    });
  };
  useEffect(() => {
    const getFiles = async () => {
      const response = await fetch(
        "https://api.github.com/repos/hackernoon/where-startups-trend/contents/2021/votes_by_startup.json"
      );

      const data = await response.json();

      const base64Data = JSON.parse(atob(data.content));
      createPieData(base64Data.votesByStartup);
    };

    getFiles();
  }, []);
  return (
    <>
      <h2>VotesByStartup</h2>

      <PieChart data={refinedData} />
    </>
  );
}
