import React from "react";
import { runForceGraph } from "./util/ForceGraph";

export function ForceGraph({ data }) {
  const containerRef = React.useRef(null);
  const updateRef = React.useRef<(dataIn: any) => void>();

  React.useEffect(() => {
    if (containerRef.current) {
      const { update } = runForceGraph(containerRef.current, data);
      updateRef.current = update;
    }
    console.log("Initial Creation");
  }, []);

  React.useEffect(() => {
    updateRef.current(data);
    console.log("Updating");
  }, [data]);

  return <div ref={containerRef} className="forceGraph" />;
}
