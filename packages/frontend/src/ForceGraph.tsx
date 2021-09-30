import React from "react";
import { runForceGraph } from "./util/ForceGraph";

export function ForceGraph({ data }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const updateRef = React.useRef<(dataIn: any) => void>();

  React.useEffect(() => {
    let destroyFn;

    if (containerRef.current) {
      const { update, destroy } = runForceGraph(containerRef.current, data);

      updateRef.current = update;
      destroyFn = destroy;
    }
    console.log("Initial Creation");
    return destroyFn;
  }, []);

  React.useEffect(() => {
    updateRef.current(data);
    console.log("Updating");
  }, [data]);

  return <div ref={containerRef} className="forceGraph" />;
}
