import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fbDelete, fbSubscribe, fbUpsert, firebaseEnabled } from "./firebase";

// ---------- Types ----------
export type ProductionStatus =
  | "Development"
  | "Pre-Production"
  | "In Production"
  | "Post-Production";

export interface Production {
  id: string;
  title: string;
  director: string;
  producer: string;
  genre: string;
  budget: number;
  startDate: string;
  endDate: string;
  description: string;
  status: ProductionStatus;
  progress: number;
  spent: number;
  crew: number;
  scenes: number;
  script?: string;
  scriptStatus: "Pending" | "Analyzing" | "Parsed";
  revisions: number;
  shootDays: number;
  completedDays: number;
  createdAt: string;
}

export interface ScriptMeta {
  id: string;
  productionId: string;
  fileName: string;
  scenes: number;
  characters: number;
  locations: number;
  props: number;
  costumes: number;
  runtimeMinutes: number;
  uploadedAt: string;
}

export interface ShootDay {
  id: string;
  productionId?: string;
  date: string;
  scenes: string[];
  location: string;
  actors: string[];
  crew: number;
  equipment: string;
  weather: string;
  duration: string;
  conflict: boolean;
}

export interface BudgetItem {
  id: string;
  productionId?: string;
  category: string;
  description: string;
  amount: number;
}

export type NotificationType =
  | "risk"
  | "budget"
  | "script"
  | "conflict"
  | "prop"
  | "done"
  | "weather";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  agent: string;
  unread: boolean;
}

export interface AgentLog {
  id: string;
  time: string;
  agent: string;
  action: string;
  status: "queued" | "running" | "completed" | "failed" | "done";
}

export type AgentRunStatus = "idle" | "running" | "completed";
export interface AgentRuntime {
  id: string;
  status: AgentRunStatus;
  progress: number;
}

// ---------- Helpers ----------
const uid = () =>
  (globalThis.crypto?.randomUUID?.() ?? `id_${Math.random().toString(36).slice(2)}_${Date.now()}`);

const nowIso = () => new Date().toISOString();

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};
export { timeAgo };

// ---------- Seed data ----------
const seedProductions: Production[] = [
  {
    id: "p_neon",
    title: "Neon Skyline",
    director: "Ava Chen",
    producer: "Jordan Miles",
    genre: "Sci-Fi Thriller",
    budget: 4_800_000,
    startDate: "2026-07-01",
    endDate: "2026-09-15",
    description: "A rogue AI awakens in a neon-drenched megacity.",
    status: "In Production",
    progress: 62,
    spent: 2_976_000,
    crew: 84,
    scenes: 142,
    script: "Neon Skyline v4.2.pdf",
    scriptStatus: "Parsed",
    revisions: 4,
    shootDays: 34,
    completedDays: 21,
    createdAt: "2026-06-01T09:00:00.000Z",
  },
  {
    id: "p_harbor",
    title: "Harbor Light",
    director: "Marcus Reid",
    producer: "Nina Osei",
    genre: "Drama",
    budget: 1_200_000,
    startDate: "2026-08-10",
    endDate: "2026-09-30",
    description: "A lighthouse keeper confronts her family's past.",
    status: "Pre-Production",
    progress: 24,
    spent: 288_000,
    crew: 42,
    scenes: 78,
    script: "Harbor Light v2.0.docx",
    scriptStatus: "Analyzing",
    revisions: 2,
    shootDays: 22,
    completedDays: 0,
    createdAt: "2026-06-10T09:00:00.000Z",
  },
];

const seedBudgetItems: BudgetItem[] = [
  { id: "b1", category: "Equipment", description: "Camera & lens rentals", amount: 1_150_000 },
  { id: "b2", category: "Talent", description: "Principal cast fees", amount: 1_420_000 },
  { id: "b3", category: "Locations", description: "Permits & fees", amount: 680_000 },
  { id: "b4", category: "Catering", description: "Crew meals", amount: 210_000 },
  { id: "b5", category: "Transportation", description: "Crew & equipment transport", amount: 340_000 },
  { id: "b6", category: "Insurance", description: "Production insurance", amount: 280_000 },
  { id: "b7", category: "Marketing", description: "Trailer & festival promo", amount: 520_000 },
  { id: "b8", category: "Contingency", description: "Reserve fund", amount: 200_000 },
];

const seedShootDays: ShootDay[] = [
  {
    id: "s1",
    productionId: "p_neon",
    date: "2026-07-22",
    scenes: ["Sc. 12", "Sc. 13"],
    location: "Downtown LA — Rooftop",
    actors: ["Elena K.", "Marcus V."],
    crew: 42,
    equipment: "Alexa Mini LF, DJI Ronin 4D",
    weather: "Clear, 78°F",
    duration: "12h",
    conflict: false,
  },
  {
    id: "s2",
    productionId: "p_neon",
    date: "2026-07-23",
    scenes: ["Sc. 14", "Sc. 15", "Sc. 16"],
    location: "Warehouse District",
    actors: ["Elena K.", "Devon P.", "Sana R."],
    crew: 48,
    equipment: "Sony Venice 2, Steadicam",
    weather: "Partly cloudy",
    duration: "14h",
    conflict: true,
  },
  {
    id: "s3",
    productionId: "p_neon",
    date: "2026-07-24",
    scenes: ["Sc. 17"],
    location: "Griffith Observatory",
    actors: ["Marcus V."],
    crew: 28,
    equipment: "RED Komodo",
    weather: "60% rain risk",
    duration: "8h",
    conflict: true,
  },
];

const seedNotifications: AppNotification[] = [
  {
    id: "n_seed_1",
    type: "risk",
    title: "Weather risk detected",
    message: "60% chance of rain Thursday for Griffith Observatory shoot.",
    createdAt: new Date(Date.now() - 12 * 60_000).toISOString(),
    agent: "Risk Analysis Agent",
    unread: true,
  },
];

// ---------- Store ----------
interface StoreState {
  productions: Production[];
  scripts: ScriptMeta[];
  shootDays: ShootDay[];
  budgetItems: BudgetItem[];
  notifications: AppNotification[];
  agentLogs: AgentLog[];
  agentRuntimes: Record<string, AgentRuntime>;
  hydratedFromFirestore: boolean;

  createProduction: (
    p: Omit<
      Production,
      | "id"
      | "createdAt"
      | "status"
      | "progress"
      | "spent"
      | "crew"
      | "scenes"
      | "scriptStatus"
      | "revisions"
      | "shootDays"
      | "completedDays"
    > & { status?: ProductionStatus }
  ) => Production;
  updateProduction: (id: string, patch: Partial<Production>) => void;
  deleteProduction: (id: string) => void;

  addBudgetItem: (item: Omit<BudgetItem, "id">) => void;
  updateBudgetItem: (id: string, patch: Partial<BudgetItem>) => void;
  deleteBudgetItem: (id: string) => void;

  addShootDay: (day: Omit<ShootDay, "id">) => void;
  updateShootDay: (id: string, patch: Partial<ShootDay>) => void;
  deleteShootDay: (id: string) => void;

  addNotification: (
    n: Omit<AppNotification, "id" | "createdAt" | "unread"> & { unread?: boolean }
  ) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  addAgentLog: (log: Omit<AgentLog, "id" | "time">) => void;
  setAgentRuntime: (id: string, r: Partial<AgentRuntime>) => void;
  resetAgentRuntimes: () => void;

  uploadScript: (
    productionId: string,
    fileName: string,
    onProgress?: (p: number) => void
  ) => Promise<ScriptMeta>;
  runAnalysis: () => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      productions: seedProductions,
      scripts: [],
      shootDays: seedShootDays,
      budgetItems: seedBudgetItems,
      notifications: seedNotifications,
      agentLogs: [],
      agentRuntimes: {},
      hydratedFromFirestore: false,

      // ----- Productions -----
      createProduction: (input) => {
        const p: Production = {
          id: uid(),
          createdAt: nowIso(),
          status: input.status ?? "Development",
          progress: 0,
          spent: 0,
          crew: 0,
          scenes: 0,
          scriptStatus: "Pending",
          revisions: 0,
          shootDays: 0,
          completedDays: 0,
          ...input,
        };
        set((s) => ({ productions: [p, ...s.productions] }));
        fbUpsert("productions", p);
        get().addNotification({
          type: "done",
          title: "Production created",
          message: `${p.title} added to the workspace.`,
          agent: "Producer Agent",
        });
        return p;
      },
      updateProduction: (id, patch) => {
        set((s) => ({
          productions: s.productions.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }));
        const updated = get().productions.find((p) => p.id === id);
        if (updated) fbUpsert("productions", updated);
      },
      deleteProduction: (id) => {
        const p = get().productions.find((x) => x.id === id);
        set((s) => ({
          productions: s.productions.filter((x) => x.id !== id),
          shootDays: s.shootDays.filter((d) => d.productionId !== id),
          scripts: s.scripts.filter((sc) => sc.productionId !== id),
        }));
        fbDelete("productions", id);
        if (p) {
          get().addNotification({
            type: "done",
            title: "Production deleted",
            message: `${p.title} was removed.`,
            agent: "Producer Agent",
          });
        }
      },

      // ----- Budget -----
      addBudgetItem: (item) => {
        const b: BudgetItem = { id: uid(), ...item };
        set((s) => ({ budgetItems: [b, ...s.budgetItems] }));
        fbUpsert("budgetItems", b);
        get().addNotification({
          type: "budget",
          title: "Budget item added",
          message: `${b.category}: $${b.amount.toLocaleString()} — ${b.description}`,
          agent: "Budget Agent",
        });
      },
      updateBudgetItem: (id, patch) => {
        set((s) => ({
          budgetItems: s.budgetItems.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        }));
        const b = get().budgetItems.find((x) => x.id === id);
        if (b) {
          fbUpsert("budgetItems", b);
          get().addNotification({
            type: "budget",
            title: "Budget updated",
            message: `${b.category}: now $${b.amount.toLocaleString()}`,
            agent: "Budget Agent",
          });
        }
      },
      deleteBudgetItem: (id) => {
        set((s) => ({ budgetItems: s.budgetItems.filter((b) => b.id !== id) }));
        fbDelete("budgetItems", id);
      },

      // ----- Schedule -----
      addShootDay: (day) => {
        const d: ShootDay = { id: uid(), ...day };
        set((s) => ({ shootDays: [...s.shootDays, d].sort((a, b) => a.date.localeCompare(b.date)) }));
        fbUpsert("shootDays", d);
        get().addNotification({
          type: "done",
          title: "Shoot day scheduled",
          message: `${d.date} — ${d.location}`,
          agent: "Scheduling Agent",
        });
      },
      updateShootDay: (id, patch) => {
        set((s) => ({
          shootDays: s.shootDays
            .map((d) => (d.id === id ? { ...d, ...patch } : d))
            .sort((a, b) => a.date.localeCompare(b.date)),
        }));
        const d = get().shootDays.find((x) => x.id === id);
        if (d) {
          fbUpsert("shootDays", d);
          get().addNotification({
            type: "done",
            title: "Schedule modified",
            message: `${d.date} — ${d.location}`,
            agent: "Scheduling Agent",
          });
        }
      },
      deleteShootDay: (id) => {
        set((s) => ({ shootDays: s.shootDays.filter((d) => d.id !== id) }));
        fbDelete("shootDays", id);
      },

      // ----- Notifications -----
      addNotification: (n) => {
        const item: AppNotification = {
          id: uid(),
          createdAt: nowIso(),
          unread: n.unread ?? true,
          type: n.type,
          title: n.title,
          message: n.message,
          agent: n.agent,
        };
        set((s) => ({ notifications: [item, ...s.notifications].slice(0, 100) }));
        fbUpsert("notifications", item);
      },
      markNotificationRead: (id) => {
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)),
        }));
      },
      markAllNotificationsRead: () => {
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, unread: false })) }));
      },

      // ----- Agent logs / runtimes -----
      addAgentLog: (log) => {
        const l: AgentLog = {
          id: uid(),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          ...log,
        };
        set((s) => ({ agentLogs: [l, ...s.agentLogs].slice(0, 60) }));
        fbUpsert("agentLogs", l);
      },
      setAgentRuntime: (id, r) => {
        set((s) => ({
          agentRuntimes: {
            ...s.agentRuntimes,
            [id]: {
              id,
              status: r.status ?? s.agentRuntimes[id]?.status ?? "idle",
              progress: r.progress ?? s.agentRuntimes[id]?.progress ?? 0,
            },
          },
        }));
      },
      resetAgentRuntimes: () => set({ agentRuntimes: {} }),

      // ----- Script upload simulation -----
      uploadScript: async (productionId, fileName, onProgress) => {
        const prod = get().productions.find((p) => p.id === productionId);
        get().updateProduction(productionId, { script: fileName, scriptStatus: "Analyzing" });
        for (let i = 10; i <= 100; i += 10) {
          onProgress?.(i);
          await new Promise((r) => setTimeout(r, 120));
        }
        // Simulated Vertex AI analysis
        const scenes = 40 + Math.floor(Math.random() * 120);
        const characters = 8 + Math.floor(Math.random() * 20);
        const locations = 4 + Math.floor(Math.random() * 12);
        const props = 30 + Math.floor(Math.random() * 80);
        const costumes = 15 + Math.floor(Math.random() * 40);
        const runtimeMinutes = 85 + Math.floor(Math.random() * 60);
        const meta: ScriptMeta = {
          id: uid(),
          productionId,
          fileName,
          scenes,
          characters,
          locations,
          props,
          costumes,
          runtimeMinutes,
          uploadedAt: nowIso(),
        };
        set((s) => ({ scripts: [meta, ...s.scripts.filter((x) => x.productionId !== productionId)] }));
        fbUpsert("scripts", meta);
        get().updateProduction(productionId, {
          scriptStatus: "Parsed",
          scenes,
          revisions: (prod?.revisions ?? 0) + 1,
        });
        get().addNotification({
          type: "script",
          title: "Script parsed",
          message: `${fileName} — ${scenes} scenes, ${characters} characters, ${locations} locations`,
          agent: "Script Analyst",
        });
        return meta;
      },

      // ----- Agent Run Analysis -----
      runAnalysis: async () => {
        const ids = [
          "producer",
          "script",
          "schedule",
          "budget",
          "shots",
          "costume",
          "props",
          "location",
          "risk",
        ];
        get().resetAgentRuntimes();
        ids.forEach((id) => get().setAgentRuntime(id, { status: "idle", progress: 0 }));

        for (const id of ids) {
          get().setAgentRuntime(id, { status: "running", progress: 0 });
          get().addAgentLog({ agent: id, action: `Started analysis pass`, status: "running" });
          for (let p = 20; p <= 100; p += 20) {
            await new Promise((r) => setTimeout(r, 180));
            get().setAgentRuntime(id, { status: "running", progress: p });
          }
          get().setAgentRuntime(id, { status: "completed", progress: 100 });
          get().addAgentLog({ agent: id, action: `Completed analysis pass`, status: "completed" });
        }
        get().addNotification({
          type: "done",
          title: "Agent analysis complete",
          message: "All 9 agents finished a synchronized analysis pass.",
          agent: "Producer Agent",
        });
      },
    }),
    {
      name: "cinepilot-store-v1",
      partialize: (s) => ({
        productions: s.productions,
        scripts: s.scripts,
        shootDays: s.shootDays,
        budgetItems: s.budgetItems,
        notifications: s.notifications,
        agentLogs: s.agentLogs,
      }),
    }
  )
);

// ---------- Derived selectors ----------
export const useDashboardStats = () => {
  const productions = useStore((s) => s.productions);
  const budgetItems = useStore((s) => s.budgetItems);
  const shootDays = useStore((s) => s.shootDays);

  const active = productions.filter(
    (p) => p.status === "In Production" || p.status === "Pre-Production"
  );
  const totalBudget = budgetItems.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = productions.reduce((sum, p) => sum + p.spent, 0);
  const avgProgress =
    productions.length > 0
      ? Math.round(productions.reduce((s, p) => s + p.progress, 0) / productions.length)
      : 0;
  const todayIso = new Date().toISOString().slice(0, 10);
  const upcomingShootDays = shootDays.filter((d) => d.date >= todayIso).length;
  const totalCrew = productions.reduce((s, p) => s + p.crew, 0);

  return {
    productions,
    activeCount: active.length,
    totalBudget,
    totalSpent,
    avgProgress,
    upcomingShootDays,
    totalCrew,
  };
};

// ---------- Firestore hydration ----------
let subscribed = false;
export function initFirestoreSync() {
  if (!firebaseEnabled || subscribed) return;
  subscribed = true;

  const bindings: Array<[string, (items: unknown[]) => void]> = [
    ["productions", (items) => useStore.setState({ productions: items as Production[] })],
    ["scripts", (items) => useStore.setState({ scripts: items as ScriptMeta[] })],
    ["shootDays", (items) =>
      useStore.setState({
        shootDays: (items as ShootDay[]).sort((a, b) => a.date.localeCompare(b.date)),
      }),
    ],
    ["budgetItems", (items) => useStore.setState({ budgetItems: items as BudgetItem[] })],
    ["notifications", (items) =>
      useStore.setState({
        notifications: (items as AppNotification[]).sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt)
        ),
      }),
    ],
    ["agentLogs", (items) => useStore.setState({ agentLogs: items as AgentLog[] })],
  ];
  bindings.forEach(([col, apply]) => fbSubscribe(col, apply));
  useStore.setState({ hydratedFromFirestore: true });
}
