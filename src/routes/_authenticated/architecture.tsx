import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  User,
  Monitor,
  Server,
  Brain,
  FileText,
  Wallet,
  CalendarDays,
  ShieldAlert,
  Sparkles,
  Database,
  HardDrive,
  Zap,
  Cloud,
  X,
  ArrowRight,
} from "lucide-react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/architecture")({
  component: ArchitecturePage,
  head: () => ({
    meta: [
      { title: "System Architecture — CinePilot AI" },
      {
        name: "description",
        content:
          "Interactive diagram of how CinePilot AI orchestrates agents on Google Cloud.",
      },
      { property: "og:title", content: "System Architecture — CinePilot AI" },
      {
        property: "og:description",
        content:
          "Explore the multi-agent workflow powering CinePilot AI end to end.",
      },
    ],
  }),
});

type NodeId =
  | "user"
  | "frontend"
  | "cloudrun"
  | "producer"
  | "script"
  | "budget"
  | "schedule"
  | "risk"
  | "vertex"
  | "storage"
  | "firestore"
  | "functions"
  | "outputs";

interface NodeDef {
  id: NodeId;
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  detail: string;
  bullets: string[];
}

const NODES: Record<NodeId, NodeDef> = {
  user: {
    id: "user",
    label: "User",
    sub: "Producer / Director",
    icon: User,
    color: "#94a3b8",
    detail:
      "The filmmaker interacts with CinePilot through the web interface, uploading scripts and delegating production tasks.",
    bullets: ["Uploads screenplays", "Issues natural-language commands", "Reviews AI outputs"],
  },
  frontend: {
    id: "frontend",
    label: "React Frontend",
    sub: "Lovable · TanStack Start",
    icon: Monitor,
    color: "#38bdf8",
    detail:
      "SSR-ready React 19 app built with TanStack Start and Tailwind. Streams agent activity and renders dashboards in real time.",
    bullets: ["TanStack Router + Query", "shadcn/ui + Framer Motion", "Realtime agent streams"],
  },
  cloudrun: {
    id: "cloudrun",
    label: "Cloud Run Backend",
    sub: "Hosts agent APIs",
    icon: Server,
    color: "#a78bfa",
    detail:
      "Cloud Run hosts the backend services and agent APIs. Autoscaling containers expose the orchestrator to the frontend.",
    bullets: ["Agent orchestrator endpoint", "Report renderer service", "Auto-scaled containers"],
  },
  producer: {
    id: "producer",
    label: "Producer Agent",
    sub: "LangGraph orchestrator",
    icon: Brain,
    color: "#f59e0b",
    detail:
      "LangGraph orchestrates autonomous agent workflows. The Producer delegates each task to the right specialist and synthesizes results.",
    bullets: ["Plans multi-step workflows", "Delegates to specialists", "Aggregates responses"],
  },
  script: {
    id: "script",
    label: "Script Agent",
    sub: "Screenplay analysis",
    icon: FileText,
    color: "#22d3ee",
    detail:
      "Parses screenplays, extracts scenes, characters, and locations, and surfaces continuity issues.",
    bullets: ["Scene breakdowns", "Character extraction", "Continuity checks"],
  },
  budget: {
    id: "budget",
    label: "Budget Agent",
    sub: "Cost modeling",
    icon: Wallet,
    color: "#34d399",
    detail:
      "Estimates production costs across departments and projects the impact of scope changes.",
    bullets: ["Department forecasts", "Scenario modeling", "Cost-saving recommendations"],
  },
  schedule: {
    id: "schedule",
    label: "Schedule Agent",
    sub: "Shoot planning",
    icon: CalendarDays,
    color: "#f472b6",
    detail:
      "Optimizes shoot days across locations, crew availability, and weather forecasts.",
    bullets: ["Constraint solving", "Conflict detection", "Call sheet drafts"],
  },
  risk: {
    id: "risk",
    label: "Risk Agent",
    sub: "Compliance & safety",
    icon: ShieldAlert,
    color: "#f87171",
    detail:
      "Monitors weather, permits, and continuity risks. Flags issues before they hit the set.",
    bullets: ["Weather risk", "Permit compliance", "Safety alerts"],
  },
  vertex: {
    id: "vertex",
    label: "Vertex AI (Gemini)",
    sub: "Reasoning + generation",
    icon: Sparkles,
    color: "#c084fc",
    detail:
      "Vertex AI Gemini handles script analysis, planning, reasoning, and report generation for every agent.",
    bullets: ["Long-context script analysis", "Structured reasoning", "Report generation"],
  },
  storage: {
    id: "storage",
    label: "Cloud Storage",
    sub: "Objects & assets",
    icon: HardDrive,
    color: "#60a5fa",
    detail:
      "Stores uploaded scripts and generated production files such as call sheets and PDF reports.",
    bullets: ["Screenplay uploads", "Generated PDFs", "Signed-URL delivery"],
  },
  firestore: {
    id: "firestore",
    label: "Firestore",
    sub: "Structured state",
    icon: Database,
    color: "#fbbf24",
    detail:
      "Stores projects, schedules, budgets, crew information, reports, and AI activity logs.",
    bullets: ["Projects & schedules", "Crew & budgets", "Agent activity logs"],
  },
  functions: {
    id: "functions",
    label: "Cloud Functions",
    sub: "Event triggers",
    icon: Zap,
    color: "#fde047",
    detail:
      "Automatically triggers workflows after script uploads or schedule updates.",
    bullets: ["onScriptUploaded", "onScheduleUpdated", "onReportGenerated"],
  },
  outputs: {
    id: "outputs",
    label: "Reports · Call Sheets · Dashboard",
    sub: "Producer deliverables",
    icon: Cloud,
    color: "#4ade80",
    detail:
      "Final artifacts surfaced back to the filmmaker: dashboards, exportable reports, and daily call sheets.",
    bullets: ["Dashboard widgets", "PDF / CSV exports", "Daily call sheets"],
  },
};

// Layout on an SVG canvas 1000x820
const POS: Record<NodeId, { x: number; y: number }> = {
  user: { x: 500, y: 40 },
  frontend: { x: 500, y: 130 },
  cloudrun: { x: 500, y: 220 },
  producer: { x: 500, y: 320 },
  script: { x: 140, y: 440 },
  budget: { x: 380, y: 440 },
  schedule: { x: 620, y: 440 },
  risk: { x: 860, y: 440 },
  vertex: { x: 500, y: 560 },
  firestore: { x: 500, y: 650 },
  storage: { x: 500, y: 650 }, // paired horizontally
  functions: { x: 500, y: 650 },
  outputs: { x: 500, y: 760 },
};

// Data layer laid out horizontally
POS.storage = { x: 300, y: 650 };
POS.firestore = { x: 500, y: 650 };
POS.functions = { x: 700, y: 650 };

const EDGES: Array<[NodeId, NodeId]> = [
  ["user", "frontend"],
  ["frontend", "cloudrun"],
  ["cloudrun", "producer"],
  ["producer", "script"],
  ["producer", "budget"],
  ["producer", "schedule"],
  ["producer", "risk"],
  ["script", "vertex"],
  ["budget", "vertex"],
  ["schedule", "vertex"],
  ["risk", "vertex"],
  ["vertex", "storage"],
  ["vertex", "firestore"],
  ["vertex", "functions"],
  ["firestore", "outputs"],
  ["storage", "outputs"],
  ["functions", "outputs"],
];

const NODE_W = 190;
const NODE_H = 68;

type TimelineStatus = "queued" | "running" | "completed" | "failed";

interface TimelineItem {
  id: number;
  time: string;
  agent: string;
  action: string;
  status: TimelineStatus;
}

const SEED_TIMELINE: TimelineItem[] = [
  { id: 1, time: "09:41:22", agent: "Producer", action: "Received request: generate call sheet", status: "completed" },
  { id: 2, time: "09:41:24", agent: "Schedule Agent", action: "Solving Friday shoot constraints", status: "completed" },
  { id: 3, time: "09:41:27", agent: "Budget Agent", action: "Recomputing daily burn rate", status: "running" },
  { id: 4, time: "09:41:28", agent: "Risk Agent", action: "Checking weather + permit windows", status: "running" },
  { id: 5, time: "09:41:30", agent: "Script Agent", action: "Extracting scene 12 breakdown", status: "queued" },
];

const STATUS_STYLE: Record<TimelineStatus, string> = {
  queued: "border-border/60 text-muted-foreground",
  running: "border-info/40 text-info",
  completed: "border-success/40 text-success",
  failed: "border-destructive/40 text-destructive",
};

function ArchitecturePage() {
  const [selected, setSelected] = useState<NodeId | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>(SEED_TIMELINE);

  // Simulate live agent activity
  useEffect(() => {
    const agentsPool = ["Producer", "Script Agent", "Budget Agent", "Schedule Agent", "Risk Agent"];
    const actionsPool = [
      "Delegating to Vertex AI",
      "Writing to Firestore",
      "Fetching from Cloud Storage",
      "Triggering Cloud Function",
      "Aggregating agent output",
      "Rendering PDF report",
    ];
    const id = setInterval(() => {
      setTimeline((prev) => {
        // Advance statuses
        const advanced = prev.map((t) => {
          if (t.status === "queued") return { ...t, status: "running" as const };
          if (t.status === "running")
            return { ...t, status: Math.random() > 0.08 ? ("completed" as const) : ("failed" as const) };
          return t;
        });
        const next: TimelineItem = {
          id: Date.now(),
          time: new Date().toLocaleTimeString("en-US", { hour12: false }),
          agent: agentsPool[Math.floor(Math.random() * agentsPool.length)],
          action: actionsPool[Math.floor(Math.random() * actionsPool.length)],
          status: "queued",
        };
        return [next, ...advanced].slice(0, 8);
      });
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <PageHeader
        title="System Architecture"
        subtitle="An interactive map of how CinePilot AI orchestrates agents on Google Cloud."
        action={
          <Badge className="gap-1.5 bg-primary/20 text-primary border-primary/30">
            <Sparkles className="h-3 w-3" /> Live topology
          </Badge>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
        <SectionCard title="Workflow topology" subtitle="Click any node to inspect its role">
          <div className="relative w-full overflow-x-auto">
            <svg
              viewBox="0 0 1000 820"
              className="w-full h-auto min-w-[720px]"
              role="img"
              aria-label="CinePilot system architecture diagram"
            >
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--primary))" opacity="0.7" />
                </marker>
              </defs>

              {/* Edges */}
              {EDGES.map(([from, to], i) => {
                const a = POS[from];
                const b = POS[to];
                const x1 = a.x;
                const y1 = a.y + NODE_H / 2;
                const x2 = b.x;
                const y2 = b.y - NODE_H / 2;
                const active = selected === from || selected === to;
                return (
                  <g key={`${from}-${to}`}>
                    <motion.line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="hsl(var(--primary))"
                      strokeOpacity={active ? 0.9 : 0.28}
                      strokeWidth={active ? 2 : 1.2}
                      markerEnd="url(#arrow)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay: i * 0.04, duration: 0.5 }}
                    />
                  </g>
                );
              })}

              {/* Nodes */}
              {(Object.keys(NODES) as NodeId[]).map((id, i) => {
                const n = NODES[id];
                const p = POS[id];
                const Icon = n.icon;
                const active = selected === id;
                return (
                  <motion.g
                    key={id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.03 }}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelected(id)}
                  >
                    <rect
                      x={p.x - NODE_W / 2}
                      y={p.y - NODE_H / 2}
                      width={NODE_W}
                      height={NODE_H}
                      rx={14}
                      fill="hsl(var(--card))"
                      stroke={active ? n.color : "hsl(var(--border))"}
                      strokeWidth={active ? 2 : 1}
                      opacity={0.96}
                    />
                    {active && (
                      <rect
                        x={p.x - NODE_W / 2}
                        y={p.y - NODE_H / 2}
                        width={NODE_W}
                        height={NODE_H}
                        rx={14}
                        fill={n.color}
                        opacity={0.08}
                      />
                    )}
                    <foreignObject
                      x={p.x - NODE_W / 2}
                      y={p.y - NODE_H / 2}
                      width={NODE_W}
                      height={NODE_H}
                    >
                      <div className="flex h-full items-center gap-2.5 px-3">
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                          style={{ background: `color-mix(in oklab, ${n.color} 22%, transparent)` }}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold leading-tight truncate">
                            {n.label}
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate">
                            {n.sub}
                          </div>
                        </div>
                      </div>
                    </foreignObject>
                  </motion.g>
                );
              })}
            </svg>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary/70" /> Data flow
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ArrowRight className="h-3 w-3" /> Click a node to inspect
            </span>
          </div>
        </SectionCard>

        {/* Side panel */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                className="glass rounded-2xl p-5 relative overflow-hidden"
              >
                <button
                  onClick={() => setSelected(null)}
                  className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
                <div
                  className="absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl opacity-30"
                  style={{ background: NODES[selected].color }}
                />
                <div className="relative flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      background: `color-mix(in oklab, ${NODES[selected].color} 22%, transparent)`,
                    }}
                  >
                    {(() => {
                      const Icon = NODES[selected].icon;
                      return <Icon className="h-5 w-5" />;
                    })()}
                  </div>
                  <div>
                    <div className="font-display font-semibold">{NODES[selected].label}</div>
                    <div className="text-xs text-muted-foreground">{NODES[selected].sub}</div>
                  </div>
                </div>
                <p className="relative mt-4 text-sm text-foreground/80">
                  {NODES[selected].detail}
                </p>
                <ul className="relative mt-4 space-y-1.5">
                  {NODES[selected].bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-center gap-2 rounded-md bg-white/5 px-2.5 py-1.5 text-xs"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: NODES[selected].color }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass rounded-2xl p-5 text-sm text-muted-foreground"
              >
                Select any component in the diagram to see what it does and how it
                fits into the CinePilot workflow.
              </motion.div>
            )}
          </AnimatePresence>

          <SectionCard
            title="Agent Activity Timeline"
            subtitle="Live task movement across agents"
          >
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {timeline.map((t) => (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="flex items-center gap-2 rounded-lg border border-border/40 bg-white/5 px-2.5 py-2 text-xs"
                  >
                    <span className="font-mono text-[10px] text-muted-foreground w-16 shrink-0">
                      {t.time}
                    </span>
                    <span className="font-medium w-24 shrink-0 truncate">{t.agent}</span>
                    <span className="flex-1 text-muted-foreground truncate">{t.action}</span>
                    <Badge variant="outline" className={STATUS_STYLE[t.status]}>
                      {t.status}
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
