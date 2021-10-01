import fastify from "fastify";
import { getNamespaces, getNodes, getPodsForNamespace } from "./k8sgetter";

const server = fastify({ logger: { prettyPrint: true } });

server.get("/data", async (req, res) => {
  const nodes = await getNodes();
  const namespaces = await getNamespaces();

  const dataObject = {
    nodes,
    namespaces,
    pods: await Promise.all(
      namespaces.map((elem) => getPodsForNamespace(elem as string))
    ),
  };
  return dataObject;
});

server.listen(3001);
