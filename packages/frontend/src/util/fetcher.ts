import useSWR from "swr";

const fetcher = (resource: RequestInfo, init?: RequestInit | undefined) =>
  fetch(resource, init).then((res) => res.json());

export function useData() {
  const { data, error } = useSWR("/data", fetcher);
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}
