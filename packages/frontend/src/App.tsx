import React, { useEffect, useRef } from "react";
import { useData } from "./util/fetcher";
import "./index.sass";
import { ForceGraph } from "./ForceGraph";

function App() {
  const { data, isLoading, isError } = useData();

  const divRef = useRef(null);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error... {JSON.stringify(isError)}</p>}
      {!isLoading && <ForceGraph data={data} />}
    </div>
  );
}

export default App;
