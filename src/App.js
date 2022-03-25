import Domains from "./Domain";
import "./styles.css";
import VotesByRegions from "./VotesByRegions";
import VotesByStartup from "./VotesByStartup";

export default function App() {
  return (
    <div className="App">
      {/* <VotesByStartup /> */}
      {/* <Choropleth /> */}
      {/* <Domains /> */}
      <VotesByRegions />
    </div>
  );
}
