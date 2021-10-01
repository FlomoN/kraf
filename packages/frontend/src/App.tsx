import React, { useEffect, useRef } from "react";
import { useData } from "./util/fetcher";
import "./index.sass";
import { ForceGraph } from "./components/ForceGraph";
import Settings from "./components/Settings";

function App() {
  const { data, isLoading, isError } = useData();

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error... {JSON.stringify(isError)}</p>}
      {!isLoading && <ForceGraph data={data} />}
      <Settings />
    </div>
  );
}

export default App;
