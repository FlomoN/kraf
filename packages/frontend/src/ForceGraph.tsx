import React from "react";
import { runForceGraph } from "./util/forceGraph";

export function ForceGraph({ data }) {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (containerRef.current) {
      runForceGraph(containerRef.current, data);
    }
  }, []);

  return <div ref={containerRef} className="forceGraph" />;
}
