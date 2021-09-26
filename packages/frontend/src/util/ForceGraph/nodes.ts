import * as d3 from "d3";

/**
 * determines the color for a node
 * @param param0 inputs a node to determine type
 * @returns a proper color for a node
 */
function colorForType({ type }) {
  const colorMap = {
    core: "#B030B0",
    namespace: "#602080",
    pod: "#202060",
  };

  return colorMap[type];
}

/**
 * creates nodes on svg with d3
 * @param g the global svg object to append to
 * @param nodes the data nodes to create graphics from
 */
export function createNodes(
  container,
  g,
  nodes,
  simulation,
  update = undefined
) {
  //Create basic shape
  let nodeElems;
  if (!update) {
    nodeElems = g
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 12)
      .attr("fill", colorForType)
      .attr("stroke", "white");
  } else {
    nodeElems = update
      .data(nodes, (d) => d.id)
      .join("circle")
      .attr("r", 12)
      .attr("fill", colorForType)
      .attr("stroke", "white");
  }

  //create tooltip
  const tooltip = d3
    .select(container)
    .append("div")
    .attr("class", "tooltip")
    .html("Tooltip")
    .style("opacity", 0)
    .style("left", "0px")
    .style("top", "0px");

  //Handle Tooltip
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
    d.fx = Math.min(
      Math.max(event.x, 0),
      container.getBoundingClientRect().width
    );
    d.fy = Math.min(
      Math.max(event.y, 0),
      container.getBoundingClientRect().height
    );
    simulation.alpha(1).restart();
  }

  return nodeElems;
}
