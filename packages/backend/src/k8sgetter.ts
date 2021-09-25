import * as k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

export async function getNodes() {
  const nodes = await k8sApi.listNode();
  return nodes.body.items.map((item) => item.metadata!.name);
}

export async function getNamespaces() {
  const ns = await k8sApi.listNamespace();
  return ns.body.items.map((item) => item.metadata!.name);
}

export async function getPodsForNamespace(namespace: string) {
  const pods = await k8sApi.listNamespacedPod(namespace);
  return pods.body.items.map((item) => item.metadata!.name);
}
