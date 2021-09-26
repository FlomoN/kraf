/**
 * creates links
 * @param g the global svg object to append to
 * @param links the links data object to create links from
 * @returns the created links d3 object
 */
export function createLinks(g, links, update = undefined) {
  let nodeElems;
  if (!update) {
    nodeElems = g
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-opacity", 0.8)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2);
  } else {
    nodeElems = update
      .data(links, (d) => d.id)
      .join("line")
      .attr("stroke-width", 2);
  }
  return nodeElems;
}
