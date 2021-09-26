import * as d3 from "d3";
import { dataToNodes } from "./converter";
import { createLinks } from "./links";
import { createNodes } from "./nodes";

/**
 * Runs D3 Forcegraph
 * @param container div to place forcegraph in to
 * @param dataIn kubernetes data from backend
 */
export function runForceGraph(container, dataIn) {
  const [nodes, links] = dataToNodes(dataIn);

  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height;
  const width = containerRect.width;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", [0, 0, width, height].join(" "));

  const g = svg.append("g");

  svg.call(
    d3.zoom().on("zoom", (event) => {
      g.attr("transform", event.transform);
    })
  );

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d: any) => d.id)
        .distance(100)
    )
    .force("charge", d3.forceManyBody())
    .force(
      "collide",
      d3
        .forceCollide()
        .radius((d: any) => (d.radius ? d.radius * 1.1 : 12 * 1.1))
    )
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

  let linkElems = createLinks(g, links);

  let nodeElems = createNodes(container, g, nodes, simulation);

  function ticked() {
    nodeElems
      .attr("cx", (d) => {
        return d.x;
      })
      .attr("cy", (d) => {
        return d.y;
      });

    linkElems
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
  }

  return {
    update(dataIn) {
      const old = new Map(nodeElems.data().map((d) => [d.id, d]));
      let [nodes, links] = dataToNodes(dataIn);
      nodes = nodes.map((d) => Object.assign(old.get(d.id) || {}, d));
      links = links.map((d) => Object.assign({}, d));

      linkElems = createLinks(g, links, linkElems);
      nodeElems = createNodes(container, g, nodes, simulation, nodeElems);

      simulation.nodes(nodes);
      simulation.force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(50)
      );
      simulation.alpha(1).restart();
    },
  };
}
