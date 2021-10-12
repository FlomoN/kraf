import create from "zustand";

export const useStore = create((set) => ({
  nodeTypes: [],
  setNodeTypes: (items: string[]) =>
    set((state: any) => {
      return { nodeTypes: items };
    }),
}));
