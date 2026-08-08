import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ProductionToolStatus = "ready" | "pending" | "failed";

export interface ProductionTool {
  id: string;
  name: string;
  toolType: string;
  department: string;
  production: string;
  purpose: string;
  status: ProductionToolStatus;
  url?: string;
  message: string;
  createdAt: string;
  createdBy: string;
}

interface ToolsState {
  tools: ProductionTool[];
  addTool: (t: Omit<ProductionTool, "id" | "createdAt" | "createdBy">) => ProductionTool;
  removeTool: (id: string) => void;
}

const uid = () =>
  globalThis.crypto?.randomUUID?.() ?? `tool_${Math.random().toString(36).slice(2)}`;

export const useToolsStore = create<ToolsState>()(
  persist(
    (set) => ({
      tools: [],
      addTool: (t) => {
        const tool: ProductionTool = {
          ...t,
          id: uid(),
          createdAt: new Date().toISOString(),
          createdBy: "Replit Production Tools Agent",
        };
        set((s) => ({ tools: [tool, ...s.tools].slice(0, 100) }));
        return tool;
      },
      removeTool: (id) => set((s) => ({ tools: s.tools.filter((t) => t.id !== id) })),
    }),
    { name: "cinepilot-production-tools" }
  )
);
