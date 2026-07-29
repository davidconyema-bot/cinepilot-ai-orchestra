import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pin,
  Send,
  Reply,
  Trash2,
  CheckCircle2,
  CalendarDays,
  ClipboardList,
  FileText,
  Bell,
  Upload,
  Hash,
  Users,
} from "lucide-react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  CHANNELS,
  memberById,
  useCollabStore,
  type CollabChannel,
} from "@/lib/collab-store";
import { timeAgo } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/collaboration")({
  component: CollaborationPage,
  head: () => ({
    meta: [
      { title: "Project Collaboration — CinePilot AI" },
      {
        name: "description",
        content:
          "Internal production workspace: team presence, discussion channels, project board and shared documents.",
      },
      { property: "og:title", content: "Project Collaboration — CinePilot AI" },
      {
        property: "og:description",
        content: "The production team's communication hub inside CinePilot AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function CollaborationPage() {
  const {
    members,
    messages,
    tasks,
    docs,
    notices,
    sendMessage,
    togglePin,
    deleteMessage,
    toggleTask,
    addDoc,
    markNoticesRead,
  } = useCollabStore();

  const [channel, setChannel] = useState<CollabChannel>("general");
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [mentionOpen, setMentionOpen] = useState(false);

  const channelMessages = useMemo(
    () =>
      messages
        .filter((m) => m.channel === channel)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [messages, channel],
  );
  const roots = channelMessages.filter((m) => !m.parentId);
  const pinned = channelMessages.filter((m) => m.pinned);
  const unread = notices.filter((n) => n.unread).length;

  function submit() {
    const body = draft.trim();
    if (!body) return;
    sendMessage(channel, body, replyTo ?? undefined);
    setDraft("");
    setReplyTo(null);
    setMentionOpen(false);
  }

  function insertMention(name: string) {
    setDraft((d) => `${d}${d && !d.endsWith(" ") ? " " : ""}@${name.split(" ")[0]} `);
    setMentionOpen(false);
  }

  return (
    <>
      <PageHeader
        title="Project Collaboration"
        subtitle="One workspace for the whole unit — presence, discussions, the production board and shared documents."
        action={
          <Button variant="outline" onClick={markNoticesRead} className="gap-2">
            <Bell className="h-4 w-4" />
            {unread ? `${unread} new` : "All caught up"}
          </Button>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        {/* Team */}
        <div className="space-y-5">
          <SectionCard
            title="Team"
            subtitle={`${members.filter((m) => m.online).length} of ${members.length} online`}
          >
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {members.map((m) => (
                <motion.div
                  key={m.id}
                  whileHover={{ x: 2 }}
                  className="rounded-xl border border-border/50 bg-white/5 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${m.color} text-xs font-semibold text-primary-foreground`}
                      >
                        {m.name
                          .split(" ")
                          .map((p) => p[0])
                          .join("")}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background ${
                          m.online ? "bg-success" : "bg-muted-foreground/50"
                        }`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{m.name}</div>
                      <Badge variant="outline" className="mt-0.5 text-[10px]">
                        {m.role}
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">{m.activity}</p>
                  <ul className="mt-1.5 space-y-1">
                    {m.tasks.map((t) => (
                      <li
                        key={t}
                        className="flex items-start gap-1.5 text-[11px] text-foreground/80"
                      >
                        <ClipboardList className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Discussion */}
        <div className="space-y-5">
          <SectionCard className="p-0 overflow-hidden">
            <div className="flex gap-1 overflow-x-auto border-b border-border/40 p-2">
              {CHANNELS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setChannel(c.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition ${
                    channel === c.id
                      ? "bg-primary/20 text-foreground"
                      : "text-muted-foreground hover:bg-white/5"
                  }`}
                >
                  <Hash className="h-3 w-3" />
                  {c.label}
                </button>
              ))}
            </div>

            {pinned.length > 0 && (
              <div className="border-b border-border/40 bg-primary/5 px-4 py-2">
                {pinned.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 text-xs">
                    <Pin className="h-3 w-3 text-primary" />
                    <span className="truncate text-muted-foreground">{p.body}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="max-h-[440px] space-y-4 overflow-y-auto p-4">
              <AnimatePresence initial={false}>
                {roots.map((m) => {
                  const author = memberById(m.authorId);
                  const replies = channelMessages.filter((r) => r.parentId === m.id);
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="group"
                    >
                      <MessageRow
                        author={author.name}
                        role={author.role}
                        color={author.color}
                        body={m.body}
                        at={m.createdAt}
                        pinned={m.pinned}
                        onPin={() => togglePin(m.id)}
                        onReply={() => setReplyTo(m.id)}
                        onDelete={() => deleteMessage(m.id)}
                      />
                      {replies.length > 0 && (
                        <div className="ml-11 mt-2 space-y-2 border-l border-border/40 pl-3">
                          {replies.map((r) => {
                            const ra = memberById(r.authorId);
                            return (
                              <MessageRow
                                key={r.id}
                                compact
                                author={ra.name}
                                role={ra.role}
                                color={ra.color}
                                body={r.body}
                                at={r.createdAt}
                                pinned={r.pinned}
                                onPin={() => togglePin(r.id)}
                                onDelete={() => deleteMessage(r.id)}
                              />
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {roots.length === 0 && (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No messages in this channel yet — start the conversation.
                </p>
              )}
            </div>

            <div className="border-t border-border/40 p-3">
              {replyTo && (
                <div className="mb-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Reply className="h-3 w-3" />
                  Replying to a message
                  <button
                    className="text-primary hover:underline"
                    onClick={() => setReplyTo(null)}
                  >
                    cancel
                  </button>
                </div>
              )}
              {mentionOpen && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {members.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => insertMention(m.name)}
                      className="rounded-md border border-border/60 bg-white/5 px-2 py-1 text-[11px] hover:bg-white/10"
                    >
                      @{m.name.split(" ")[0]} · {m.role}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-end gap-2">
                <button
                  onClick={() => setMentionOpen((v) => !v)}
                  title="Mention a teammate"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-white/5 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-4 w-4" />
                </button>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  rows={1}
                  placeholder={`Message #${CHANNELS.find((c) => c.id === channel)?.label} — use @ to mention`}
                  className="min-h-10 flex-1 resize-none rounded-lg border border-border/60 bg-white/5 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
                <Button onClick={submit} className="h-10 gap-2">
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Shared documents"
            subtitle="Scripts, shot lists, boards, references and notes"
            action={
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.onchange = () => {
                    const f = input.files?.[0];
                    if (!f) return;
                    addDoc(
                      f.name,
                      "Production note",
                      "David Conyema",
                      `${Math.max(1, Math.round(f.size / 1024))} KB`,
                    );
                    toast.success("Document shared with the team");
                  };
                  input.click();
                }}
              >
                <Upload className="h-3.5 w-3.5" />
                Upload
              </Button>
            }
          >
            <div className="grid gap-2 sm:grid-cols-2">
              {docs.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-white/5 p-3"
                >
                  <FileText className="h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{d.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {d.kind} · {d.owner} · {d.size} · {timeAgo(d.updatedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Board + notifications */}
        <div className="space-y-5">
          <SectionCard title="Project board" subtitle="Stage: Principal photography · week 3">
            <div className="space-y-4">
              <BoardGroup
                label="Upcoming milestones"
                icon={CalendarDays}
                items={tasks.filter((t) => t.kind === "milestone")}
                onToggle={toggleTask}
              />
              <BoardGroup
                label="Scene checklist"
                icon={ClipboardList}
                items={tasks.filter((t) => t.kind === "scene")}
                onToggle={toggleTask}
              />
              <BoardGroup
                label="Shooting schedule"
                icon={CalendarDays}
                items={tasks.filter((t) => t.kind === "shoot")}
                onToggle={toggleTask}
              />
              <BoardGroup
                label="Pending approvals"
                icon={CheckCircle2}
                items={tasks.filter((t) => t.kind === "approval")}
                onToggle={toggleTask}
              />
              <BoardGroup
                label="Recently completed"
                icon={CheckCircle2}
                items={tasks.filter((t) => t.status === "completed")}
                onToggle={toggleTask}
              />
            </div>
          </SectionCard>

          <SectionCard title="Notifications" subtitle="Discussions, tasks, deadlines and meetings">
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {notices.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-xl border p-3 ${
                    n.unread ? "border-primary/40 bg-primary/5" : "border-border/50 bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{n.title}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.detail}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  );
}

function MessageRow({
  author,
  role,
  color,
  body,
  at,
  pinned,
  compact,
  onPin,
  onReply,
  onDelete,
}: {
  author: string;
  role: string;
  color: string;
  body: string;
  at: string;
  pinned: boolean;
  compact?: boolean;
  onPin: () => void;
  onReply?: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`flex ${compact ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs"} shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${color} font-semibold text-primary-foreground`}
      >
        {author
          .split(" ")
          .map((p) => p[0])
          .join("")}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{author}</span>
          <Badge variant="outline" className="text-[10px]">
            {role}
          </Badge>
          <span className="text-[10px] text-muted-foreground">{timeAgo(at)}</span>
          {pinned && <Pin className="h-3 w-3 text-primary" />}
          <span className="ml-auto flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
            {onReply && (
              <button onClick={onReply} title="Reply" className="text-muted-foreground hover:text-foreground">
                <Reply className="h-3.5 w-3.5" />
              </button>
            )}
            <button onClick={onPin} title="Pin" className="text-muted-foreground hover:text-foreground">
              <Pin className="h-3.5 w-3.5" />
            </button>
            <button onClick={onDelete} title="Delete" className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </span>
        </div>
        <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground/90">
          {body.split(/(@\w+)/g).map((part, i) =>
            part.startsWith("@") ? (
              <span key={i} className="rounded bg-primary/20 px-1 text-primary">
                {part}
              </span>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </p>
      </div>
    </div>
  );
}

function BoardGroup({
  label,
  icon: Icon,
  items,
  onToggle,
}: {
  label: string;
  icon: typeof CalendarDays;
  items: { id: string; title: string; owner: string; due: string; status: string }[];
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="space-y-1.5">
        {items.map((t) => (
          <button
            key={t.id}
            onClick={() => onToggle(t.id)}
            className="flex w-full items-start gap-2 rounded-lg border border-border/50 bg-white/5 p-2 text-left hover:bg-white/10"
          >
            <CheckCircle2
              className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                t.status === "completed" ? "text-success" : "text-muted-foreground"
              }`}
            />
            <span className="min-w-0 flex-1">
              <span
                className={`block text-xs ${
                  t.status === "completed" ? "line-through text-muted-foreground" : ""
                }`}
              >
                {t.title}
              </span>
              <span className="block text-[10px] text-muted-foreground">
                {t.owner} · {t.due}
              </span>
            </span>
          </button>
        ))}
        {items.length === 0 && (
          <p className="text-[11px] text-muted-foreground">Nothing here yet.</p>
        )}
      </div>
    </div>
  );
}
