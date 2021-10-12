import { useStore } from "../store";

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
  console.log(data);

  const nodes: Node[] = [];
  const links: Link[] = [];

  //Create Center target (Cluster)
  nodes.push({
    id: "Cluster",
    type: "core",
  });

  //Push all nodes
  data.nodes.forEach((element) => {
    nodes.push({
      id: element,
      type: "node",
    });
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

  //All pods
  data.pods.forEach((element, index) => {
    element.forEach((pod) => {
      // Push each Pod
      nodes.push({
        id: pod.name,
        type: "pod",
      });

      // Create link to namespaces
      links.push({
        id: pod.namespace + "-" + pod.name,
        source: pod.namespace,
        target: pod.name,
      });

      // Create link to nodes
      links.push({
        id: pod.node + "-" + pod.name,
        source: pod.node,
        target: pod.name,
      });
    });
  });

  const setNodeTypes = (useStore.getState() as any).setNodeTypes;
  const nodeSet = new Set(nodes.map((elem) => elem.type));
  setNodeTypes(Array.from(nodeSet.values()));

  return [nodes, links];
}
