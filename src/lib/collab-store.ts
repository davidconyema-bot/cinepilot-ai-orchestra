import { create } from "zustand";
import { persist } from "zustand/middleware";

// ---------- Types ----------
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  online: boolean;
  activity: string;
  tasks: string[];
  color: string;
}

export interface CollabMessage {
  id: string;
  authorId: string;
  channel: CollabChannel;
  body: string;
  createdAt: string;
  pinned: boolean;
  parentId?: string;
}

export type CollabChannel =
  | "general"
  | "script"
  | "schedule"
  | "scenes"
  | "editing"
  | "costume"
  | "cinematography";

export const CHANNELS: { id: CollabChannel; label: string }[] = [
  { id: "general", label: "Production Updates" },
  { id: "script", label: "Script Revisions" },
  { id: "schedule", label: "Scheduling" },
  { id: "scenes", label: "Scene Changes" },
  { id: "editing", label: "Editing Notes" },
  { id: "costume", label: "Costume" },
  { id: "cinematography", label: "Cinematography" },
];

export interface BoardTask {
  id: string;
  title: string;
  owner: string;
  due: string;
  status: "pending" | "approved" | "completed";
  kind: "milestone" | "scene" | "shoot" | "approval" | "task";
}

export interface SharedDoc {
  id: string;
  name: string;
  kind:
    | "Script draft"
    | "Shot list"
    | "Storyboard"
    | "Production note"
    | "Costume reference"
    | "Mood board"
    | "Meeting notes";
  owner: string;
  size: string;
  updatedAt: string;
  body?: string;
}

export interface CollabNotice {
  id: string;
  kind: "discussion" | "task" | "script" | "deadline" | "meeting" | "announcement";
  title: string;
  detail: string;
  createdAt: string;
  unread: boolean;
}

const uid = () =>
  globalThis.crypto?.randomUUID?.() ??
  `id_${Math.random().toString(36).slice(2)}_${Date.now()}`;
const nowIso = () => new Date().toISOString();
const ago = (m: number) => new Date(Date.now() - m * 60000).toISOString();

export const TEAM: TeamMember[] = [
  {
    id: "director",
    name: "Amara Okoye",
    role: "Director",
    online: true,
    activity: "Reviewed scene 42 blocking",
    tasks: ["Lock act II coverage", "Approve dailies"],
    color: "from-primary to-accent",
  },
  {
    id: "screenwriter",
    name: "Tobi Adeyemi",
    role: "Screenwriter",
    online: true,
    activity: "Uploaded revision v7 (blue pages)",
    tasks: ["Rewrite scene 18 dialogue"],
    color: "from-accent to-primary",
  },
  {
    id: "producer",
    name: "David Conyema",
    role: "Producer",
    online: true,
    activity: "Signed off location permits",
    tasks: ["Close insurance rider", "Review week 3 spend"],
    color: "from-primary to-success",
  },
  {
    id: "dop",
    name: "Lena Vasquez",
    role: "Cinematographer",
    online: false,
    activity: "Shared anamorphic test frames",
    tasks: ["Lens test for night exteriors"],
    color: "from-accent to-success",
  },
  {
    id: "editor",
    name: "Marcus Feld",
    role: "Editor",
    online: true,
    activity: "Cut assembly for scenes 1–12",
    tasks: ["Deliver rough cut reel 1"],
    color: "from-primary to-accent",
  },
  {
    id: "costume",
    name: "Ifeoma Nwosu",
    role: "Costume Designer",
    online: false,
    activity: "Fitting notes for lead wardrobe",
    tasks: ["Source period coats"],
    color: "from-warning to-accent",
  },
  {
    id: "production-design",
    name: "Hugo Bertrand",
    role: "Production Designer",
    online: true,
    activity: "Set dressing plan for the loft",
    tasks: ["Finalize loft build"],
    color: "from-accent to-warning",
  },
  {
    id: "sound",
    name: "Sara Lindqvist",
    role: "Sound Designer",
    online: false,
    activity: "Captured city ambience library",
    tasks: ["Spot reel 2 for ADR"],
    color: "from-success to-primary",
  },
  {
    id: "composer",
    name: "Ken Watanabe",
    role: "Composer",
    online: true,
    activity: "Drafted main theme sketch",
    tasks: ["Deliver temp score"],
    color: "from-primary to-warning",
  },
  {
    id: "vfx",
    name: "Priya Raman",
    role: "VFX Supervisor",
    online: true,
    activity: "Bid breakdown for 62 shots",
    tasks: ["Previz the rooftop chase"],
    color: "from-accent to-primary",
  },
  {
    id: "ad",
    name: "Jonas Meyer",
    role: "Assistant Director",
    online: true,
    activity: "Issued call sheet #14",
    tasks: ["Publish day 15 call sheet"],
    color: "from-success to-accent",
  },
  {
    id: "marketing",
    name: "Zoe Carter",
    role: "Marketing Team",
    online: false,
    activity: "Teaser cut feedback round",
    tasks: ["Plan first-look stills"],
    color: "from-warning to-primary",
  },
];

const seedMessages: CollabMessage[] = [
  {
    id: uid(),
    authorId: "director",
    channel: "general",
    body: "Morning team — day 14 is locked. @ad please circulate the call sheet by noon.",
    createdAt: ago(240),
    pinned: true,
  },
  {
    id: uid(),
    authorId: "screenwriter",
    channel: "script",
    body: "Blue pages for scene 18 are up. @director the confrontation now lands two beats earlier.",
    createdAt: ago(180),
    pinned: false,
  },
  {
    id: uid(),
    authorId: "dop",
    channel: "cinematography",
    body: "Anamorphic tests look great at T2.8. Suggest we keep practicals warm for the loft.",
    createdAt: ago(120),
    pinned: false,
  },
  {
    id: uid(),
    authorId: "costume",
    channel: "costume",
    body: "Lead's coat swap approved — the charcoal reads better against the loft palette.",
    createdAt: ago(90),
    pinned: false,
  },
  {
    id: uid(),
    authorId: "editor",
    channel: "editing",
    body: "Assembly of reels 1–2 is in the shared drive. Notes welcome before Friday.",
    createdAt: ago(45),
    pinned: false,
  },
];

const seedTasks: BoardTask[] = [
  { id: uid(), title: "Principal photography — week 3", owner: "Jonas Meyer", due: "In progress", status: "pending", kind: "milestone" },
  { id: uid(), title: "Picture lock target", owner: "Marcus Feld", due: "Sep 12", status: "pending", kind: "milestone" },
  { id: uid(), title: "Scene 18 — loft confrontation", owner: "Amara Okoye", due: "Day 15", status: "pending", kind: "scene" },
  { id: uid(), title: "Scene 22 — rooftop chase", owner: "Priya Raman", due: "Day 17", status: "pending", kind: "scene" },
  { id: uid(), title: "Night exterior block", owner: "Lena Vasquez", due: "Day 16", status: "pending", kind: "shoot" },
  { id: uid(), title: "VFX bid approval", owner: "David Conyema", due: "Today", status: "pending", kind: "approval" },
  { id: uid(), title: "Costume budget increase", owner: "David Conyema", due: "Tomorrow", status: "pending", kind: "approval" },
  { id: uid(), title: "Location permits filed", owner: "David Conyema", due: "Done", status: "completed", kind: "task" },
  { id: uid(), title: "Call sheet #14 issued", owner: "Jonas Meyer", due: "Done", status: "completed", kind: "task" },
];

const seedDocs: SharedDoc[] = [
  { id: uid(), name: "ECLIPSE_v7_blue.pdf", kind: "Script draft", owner: "Tobi Adeyemi", size: "1.8 MB", updatedAt: ago(180), body: "ECLIPSE — Revision v7 (blue pages)\n\nSCENE 18 — INT. LOFT — NIGHT\nThe confrontation lands two beats earlier." },
  { id: uid(), name: "Day15_shotlist.pdf", kind: "Shot list", owner: "Lena Vasquez", size: "420 KB", updatedAt: ago(300), body: "Day 15 shot list\n1. Wide master, 40mm\n2. OTS coverage\n3. Insert: the letter" },
  { id: uid(), name: "Rooftop_chase_boards.pdf", kind: "Storyboard", owner: "Priya Raman", size: "6.2 MB", updatedAt: ago(600) },
  { id: uid(), name: "Loft_set_notes.pdf", kind: "Production note", owner: "Hugo Bertrand", size: "310 KB", updatedAt: ago(720) },
  { id: uid(), name: "Costume_refs_lead.pdf", kind: "Costume reference", owner: "Ifeoma Nwosu", size: "3.4 MB", updatedAt: ago(900) },
  { id: uid(), name: "Palette_moodboard.pdf", kind: "Mood board", owner: "Amara Okoye", size: "5.1 MB", updatedAt: ago(1400) },
  { id: uid(), name: "Prod_meeting_0712.pdf", kind: "Meeting notes", owner: "Jonas Meyer", size: "180 KB", updatedAt: ago(2000) },
];

const seedNotices: CollabNotice[] = [
  { id: uid(), kind: "script", title: "Script updated", detail: "Tobi Adeyemi uploaded revision v7 (blue pages).", createdAt: ago(180), unread: true },
  { id: uid(), kind: "task", title: "Task assigned", detail: "Publish day 15 call sheet — Jonas Meyer.", createdAt: ago(150), unread: true },
  { id: uid(), kind: "meeting", title: "Meeting reminder", detail: "Production sync at 17:00 in the loft office.", createdAt: ago(60), unread: true },
  { id: uid(), kind: "deadline", title: "Deadline reminder", detail: "VFX bid approval due today.", createdAt: ago(30), unread: false },
  { id: uid(), kind: "announcement", title: "Production announcement", detail: "Week 3 wraps Friday — dailies review moved to Saturday.", createdAt: ago(20), unread: false },
];

interface CollabState {
  members: TeamMember[];
  messages: CollabMessage[];
  tasks: BoardTask[];
  docs: SharedDoc[];
  notices: CollabNotice[];
  sendMessage: (channel: CollabChannel, body: string, parentId?: string) => void;
  togglePin: (id: string) => void;
  deleteMessage: (id: string) => void;
  toggleTask: (id: string) => void;
  addDoc: (name: string, kind: SharedDoc["kind"], owner: string, size: string) => void;
  markNoticesRead: () => void;
  pushNotice: (n: Omit<CollabNotice, "id" | "createdAt" | "unread">) => void;
}

export const useCollabStore = create<CollabState>()(
  persist(
    (set, get) => ({
      members: TEAM,
      messages: seedMessages,
      tasks: seedTasks,
      docs: seedDocs,
      notices: seedNotices,

      sendMessage: (channel, body, parentId) => {
        const msg: CollabMessage = {
          id: uid(),
          authorId: "producer",
          channel,
          body,
          createdAt: nowIso(),
          pinned: false,
          parentId,
        };
        set({ messages: [...get().messages, msg] });
        get().pushNotice({
          kind: "discussion",
          title: parentId ? "New reply" : "New discussion",
          detail: body.slice(0, 90),
        });
      },

      togglePin: (id) =>
        set({
          messages: get().messages.map((m) =>
            m.id === id ? { ...m, pinned: !m.pinned } : m,
          ),
        }),

      deleteMessage: (id) =>
        set({
          messages: get().messages.filter((m) => m.id !== id && m.parentId !== id),
        }),

      toggleTask: (id) =>
        set({
          tasks: get().tasks.map((t) =>
            t.id === id
              ? { ...t, status: t.status === "completed" ? "pending" : "completed" }
              : t,
          ),
        }),

      addDoc: (name, kind, owner, size) => {
        const doc: SharedDoc = { id: uid(), name, kind, owner, size, updatedAt: nowIso() };
        set({ docs: [doc, ...get().docs] });
        get().pushNotice({
          kind: "announcement",
          title: "Document shared",
          detail: `${owner} shared ${name}`,
        });
      },

      markNoticesRead: () =>
        set({ notices: get().notices.map((n) => ({ ...n, unread: false })) }),

      pushNotice: (n) =>
        set({
          notices: [
            { ...n, id: uid(), createdAt: nowIso(), unread: true },
            ...get().notices,
          ].slice(0, 40),
        }),
    }),
    { name: "cinepilot-collab" },
  ),
);

export function memberById(id: string) {
  return TEAM.find((m) => m.id === id) ?? TEAM[0];
}
