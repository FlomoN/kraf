import * as k8s from "@kubernetes/client-node";
import { PodData } from "./IK8s";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

/**
 * returns all nodes of the cluster
 * @returns an array of nodes
 */
export async function getNodes() {
  const nodes = await k8sApi.listNode();
  return nodes.body.items.map((item) => item.metadata!.name);
}

/**
 * receives all namespaces of the cluster
 * @returns an array of namespaces
 */
export async function getNamespaces() {
  const ns = await k8sApi.listNamespace();
  return ns.body.items.map((item) => item.metadata!.name);
}

/**
 * returns the pods for a given namespace
 * @param namespace namespace to receive pods for
 * @returns an array of pods
 */
export async function getPodsForNamespace(
  namespace: string
): Promise<PodData[]> {
  const pods = await k8sApi.listNamespacedPod(namespace);
  return pods.body.items.map((item) => {
    return {
      name: item.metadata!.name!,
      namespace: item.metadata!.namespace,
      node: item.spec!.nodeName,
    };
  });
}
