import { create } from "zustand";
import { persist } from "zustand/middleware";

export const ACTOR_EMAIL = "nusaibasaudu@gmail.com";
export const ACTOR_PASSWORD = "12345678";

export const actorProfile = {
  name: "Nusaiba Saudu",
  role: "Lead Actor",
  agency: "Northlight Talent Agency",
  email: ACTOR_EMAIL,
  phone: "+234 802 114 8890",
  location: "Lagos · Abuja",
  bio: "Screen and stage actor known for grounded, physical performances. Currently playing Amina in the feature ECLIPSE and recurring lead in the limited series HARMATTAN.",
  productions: ["ECLIPSE", "HARMATTAN"],
};

export interface ActorMovie {
  id: string;
  title: string;
  character: string;
  status: string;
  director: string;
  producer: string;
  progress: number;
  release: string;
  accent: string;
}

export const actorMovies: ActorMovie[] = [
  {
    id: "eclipse",
    title: "ECLIPSE",
    character: "Amina Bello (Lead)",
    status: "In Production",
    director: "Amara Okoye",
    producer: "David Conyema",
    progress: 62,
    release: "Q3 2027",
    accent: "from-primary/40 to-accent/30",
  },
  {
    id: "harmattan",
    title: "HARMATTAN",
    character: "Dr. Zara Idris (Recurring lead)",
    status: "Post-Production",
    director: "Femi Balogun",
    producer: "Grace Umeh",
    progress: 88,
    release: "Q1 2027",
    accent: "from-accent/40 to-warning/30",
  },
  {
    id: "lagos-nights",
    title: "LAGOS NIGHTS",
    character: "Ify (Supporting)",
    status: "Pre-Production",
    director: "Tunde Ojo",
    producer: "Sade Martins",
    progress: 18,
    release: "Q4 2027",
    accent: "from-success/40 to-primary/30",
  },
];

export interface ActorScript {
  id: string;
  movie: string;
  scene: string;
  revision: string;
  updated: string;
  read: boolean;
  body: string;
}

export interface ActorScene {
  id: string;
  date: string;
  scene: string;
  callTime: string;
  location: string;
  director: string;
  wardrobe: string;
  notes: string;
}

export const actorSchedule: ActorScene[] = [
  {
    id: "d15",
    date: "Mon, Aug 3",
    scene: "Sc. 18 — Loft confrontation",
    callTime: "06:30",
    location: "Loft Stage B, Lekki",
    director: "Amara Okoye",
    wardrobe: "Charcoal coat, silver ring",
    notes: "Rehearsal on set at 07:15. Stunt double on standby.",
  },
  {
    id: "d16",
    date: "Tue, Aug 4",
    scene: "Sc. 22 — Rooftop chase",
    callTime: "16:00",
    location: "Marina Tower rooftop",
    director: "Amara Okoye",
    wardrobe: "Chase outfit, padded knees",
    notes: "Night exterior. Safety briefing mandatory.",
  },
  {
    id: "d17",
    date: "Thu, Aug 6",
    scene: "Sc. 27 — Hospital corridor",
    callTime: "08:00",
    location: "St. Anne Hospital (practical)",
    director: "Amara Okoye",
    wardrobe: "Hospital scrubs (blood continuity)",
    notes: "Makeup continuity from Sc. 26.",
  },
  {
    id: "d18",
    date: "Sat, Aug 8",
    scene: "Sc. 31 — Family dinner",
    callTime: "10:30",
    location: "Ikoyi house, dining room",
    director: "Amara Okoye",
    wardrobe: "Green wrapper dress",
    notes: "Table read with supporting cast at 09:45.",
  },
];

export interface ActorNote {
  id: string;
  date: string;
  scene: string;
  priority: "High" | "Medium" | "Low";
  from: string;
  comment: string;
  done: boolean;
}

export interface ActorNotice {
  id: string;
  kind: "script" | "scene" | "note" | "schedule" | "wardrobe" | "meeting";
  title: string;
  detail: string;
  time: string;
  unread: boolean;
}

export interface ActorMessage {
  id: string;
  thread: string;
  from: "me" | string;
  body: string;
  time: string;
}

export interface ActorDoc {
  id: string;
  name: string;
  kind: "Contract" | "Call sheet" | "Production" | "Wardrobe" | "Rehearsal";
  size: string;
  updated: string;
  body: string;
}

const scriptBody = (movie: string, scene: string, revision: string) =>
  `${movie} — ${scene}\nRevision ${revision}\n\nINT. LOCATION — NIGHT\n\nAMINA stands in the doorway, rain still on her shoulders.\n\nAMINA\nYou said you would wait. You never wait.\n\nShe steps forward. The room holds its breath.\n\n(CONTINUED)`;

const seedScripts: ActorScript[] = [
  { id: "s1", movie: "ECLIPSE", scene: "Scene 18", revision: "v7 (blue)", updated: "Jul 27, 2026", read: false, body: scriptBody("ECLIPSE", "Scene 18 — Loft confrontation", "v7") },
  { id: "s2", movie: "ECLIPSE", scene: "Scene 22", revision: "v6 (pink)", updated: "Jul 24, 2026", read: false, body: scriptBody("ECLIPSE", "Scene 22 — Rooftop chase", "v6") },
  { id: "s3", movie: "ECLIPSE", scene: "Scene 27", revision: "v5", updated: "Jul 20, 2026", read: true, body: scriptBody("ECLIPSE", "Scene 27 — Hospital corridor", "v5") },
  { id: "s4", movie: "HARMATTAN", scene: "Episode 4, Sc. 9", revision: "v3", updated: "Jul 14, 2026", read: true, body: scriptBody("HARMATTAN", "Episode 4, Scene 9", "v3") },
  { id: "s5", movie: "LAGOS NIGHTS", scene: "Scene 2", revision: "v1", updated: "Jul 08, 2026", read: false, body: scriptBody("LAGOS NIGHTS", "Scene 2 — Market opening", "v1") },
];

const seedNotes: ActorNote[] = [
  { id: "n1", date: "Jul 28", scene: "Sc. 18", priority: "High", from: "Amara Okoye", comment: "Hold the pause before the last line — let the silence do the work.", done: false },
  { id: "n2", date: "Jul 27", scene: "Sc. 22", priority: "Medium", from: "Amara Okoye", comment: "Keep the breathing audible during the chase; we'll use it in the sound mix.", done: false },
  { id: "n3", date: "Jul 25", scene: "Sc. 27", priority: "Low", from: "Amara Okoye", comment: "Lovely take 4. Keep the eyeline slightly camera-left.", done: true },
  { id: "n4", date: "Jul 22", scene: "Sc. 31", priority: "Medium", from: "Amara Okoye", comment: "Play the dinner warmer at the top so the turn hits harder.", done: false },
];

const seedNotices: ActorNotice[] = [
  { id: "an1", kind: "script", title: "New script uploaded", detail: "ECLIPSE Sc. 18 revision v7 (blue pages).", time: "2h ago", unread: true },
  { id: "an2", kind: "scene", title: "Scene changed", detail: "Sc. 22 moved to a night exterior block.", time: "4h ago", unread: true },
  { id: "an3", kind: "note", title: "Director note received", detail: "Amara Okoye left a note on Sc. 18.", time: "6h ago", unread: true },
  { id: "an4", kind: "schedule", title: "Shooting schedule updated", detail: "Day 16 call time moved to 16:00.", time: "1d ago", unread: false },
  { id: "an5", kind: "wardrobe", title: "Wardrobe fitting reminder", detail: "Fitting Friday 14:00 with Ifeoma Nwosu.", time: "1d ago", unread: false },
  { id: "an6", kind: "meeting", title: "Production meeting", detail: "Cast sync Saturday 11:00, loft office.", time: "2d ago", unread: false },
];

const seedMessages: ActorMessage[] = [
  { id: "m1", thread: "Amara Okoye", from: "Amara Okoye", body: "Great work today. Let's revisit the doorway beat tomorrow.", time: "09:12" },
  { id: "m2", thread: "Amara Okoye", from: "me", body: "Thank you — I'll come in early to rehearse it.", time: "09:20" },
  { id: "m3", thread: "David Conyema", from: "David Conyema", body: "Contract addendum for the extra shoot day is in Documents.", time: "Yesterday" },
  { id: "m4", thread: "Jonas Meyer", from: "Jonas Meyer", body: "Call sheet #15 is out — your call time is 06:30.", time: "Yesterday" },
  { id: "m5", thread: "Tobi Adeyemi", from: "Tobi Adeyemi", body: "Sc. 18 dialogue tightened. Curious what you think of the new last line.", time: "Mon" },
];

export const ACTOR_THREADS = [
  { id: "Amara Okoye", role: "Director" },
  { id: "David Conyema", role: "Producer" },
  { id: "Jonas Meyer", role: "Assistant Director" },
  { id: "Tobi Adeyemi", role: "Screenwriter" },
];

export const actorDocs: ActorDoc[] = [
  { id: "doc1", name: "ECLIPSE_lead_contract.pdf", kind: "Contract", size: "240 KB", updated: "Jul 02, 2026", body: "ECLIPSE — Performer Agreement\nArtist: Nusaiba Saudu\nRole: Amina Bello (Lead)\nTerm: 42 shooting days." },
  { id: "doc2", name: "Callsheet_day15.pdf", kind: "Call sheet", size: "180 KB", updated: "Jul 28, 2026", body: "Call sheet Day 15\nUnit call 06:00 · Talent call 06:30\nLocation: Loft Stage B, Lekki" },
  { id: "doc3", name: "Production_handbook.pdf", kind: "Production", size: "1.1 MB", updated: "Jun 18, 2026", body: "ECLIPSE production handbook — safety, transport and on-set protocol." },
  { id: "doc4", name: "Wardrobe_amina_refs.pdf", kind: "Wardrobe", size: "2.6 MB", updated: "Jul 21, 2026", body: "Wardrobe references for Amina: charcoal coat, silver ring, green wrapper dress." },
  { id: "doc5", name: "Rehearsal_notes_sc18.pdf", kind: "Rehearsal", size: "96 KB", updated: "Jul 26, 2026", body: "Rehearsal notes, Sc. 18 — beats, pauses and blocking marks." },
];

// ---------- Minimal PDF generator (no dependencies) ----------
export function downloadPdf(fileName: string, title: string, body: string) {
  const lines = [title, "", ...body.split("\n")];
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const text = lines
    .map((l, i) => `BT /F1 ${i === 0 ? 16 : 11} Tf 56 ${760 - i * 20} Td (${esc(l)}) Tj ET`)
    .join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${text.length} >>\nstream\n${text}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((o, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((o) => {
    pdf += `${String(o).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------- Store ----------
interface ActorState {
  scripts: ActorScript[];
  notes: ActorNote[];
  notices: ActorNotice[];
  messages: ActorMessage[];
  markScriptRead: (id: string) => void;
  toggleNote: (id: string) => void;
  markNoticesRead: () => void;
  sendMessage: (thread: string, body: string) => void;
}

export const useActorStore = create<ActorState>()(
  persist(
    (set, get) => ({
      scripts: seedScripts,
      notes: seedNotes,
      notices: seedNotices,
      messages: seedMessages,
      markScriptRead: (id) =>
        set({ scripts: get().scripts.map((s) => (s.id === id ? { ...s, read: true } : s)) }),
      toggleNote: (id) =>
        set({ notes: get().notes.map((n) => (n.id === id ? { ...n, done: !n.done } : n)) }),
      markNoticesRead: () =>
        set({ notices: get().notices.map((n) => ({ ...n, unread: false })) }),
      sendMessage: (thread, body) =>
        set({
          messages: [
            ...get().messages,
            {
              id: `m_${Date.now()}`,
              thread,
              from: "me",
              body,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ],
        }),
    }),
    { name: "cinepilot-actor" },
  ),
);
