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
export function dataToNodes(data): [any[], any[]] {
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
