import * as d3 from "d3";

interface Node {
  id: string;
  type: string;
}

interface Link {
  id: string;
  source: string;
  target: string;
}

/**
 * Turns data into nodes and links for d3
 * @param data incoming data from backend
 * @returns data transformed into nodes and links for d3
 */
function dataToNodes(data): [any[], any[]] {
  const nodes: Node[] = [];
  const links: Link[] = [];

  //Create Center target (Cluster)
  nodes.push({
    id: "Cluster",
    type: "core",
  });

  //Push all namespaces
  data.namespaces.forEach((element) => {
    nodes.push({
      id: element,
      type: "namespace",
    });

    //Create Link to core
    links.push({
      id: "Cluster-" + element,
      source: "Cluster",
      target: element,
    });
  });

  data.pods.forEach((element, index) => {
    element.forEach((pod) => {
      // Push each Pod
      nodes.push({
        id: pod,
        type: "pod",
      });

      // Create link to namespaces
      links.push({
        id: data.namespaces[index] + "-" + pod,
        source: data.namespaces[index],
        target: pod,
      });
    });
  });

  return [nodes, links];
}

function colorForType({ type }) {
  const colorMap = {
    core: "#B030B0",
    namespace: "#602080",
    pod: "#202060",
  };

  return colorMap[type];
}

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

  const linkElems = g
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-opacity", 0.8)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", 2);

  const nodeElems = g
    .append("g")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 12)
    .attr("fill", colorForType)
    .attr("stroke", "white");

  nodeElems
    .on("mouseover", (event, d) => {
      tooltip
        .html(d.id)
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY + 5 + "px")
        .style("opacity", 0.9);
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0).style("left", "0px").style("top", "0px");
    });

  const drag = d3.drag().on("start", dragstart).on("drag", dragged);

  nodeElems.call(drag).on("click", click);

  function click(event, d) {
    delete d.fx;
    delete d.fy;
    d3.select(this).classed("fixed", false);
    simulation.alpha(1).restart();
  }

  function dragstart() {
    d3.select(this).classed("fixed", true);
  }

  function dragged(event, d) {
    d.fx = Math.min(Math.max(event.x, 0), width);
    d.fy = Math.min(Math.max(event.y, 0), height);
    simulation.alpha(1).restart();
  }

  const tooltip = d3
    .select(container)
    .append("div")
    .attr("class", "tooltip")
    .html("Tooltip")
    .style("opacity", 0)
    .style("left", "0px")
    .style("top", "0px");

  const ticked = () => {
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
  };

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d: any) => d.id)
        .distance(50)
    )
    .force("charge", d3.forceManyBody())
    .force(
      "collide",
      d3.forceCollide().radius((d: any) => (d.radius ? d.radius : 12))
    )
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);
}
