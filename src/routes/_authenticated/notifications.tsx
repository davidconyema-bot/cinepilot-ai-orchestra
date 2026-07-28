import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Cloud,
  FileText,
  Package,
  Users,
  Wallet,
} from "lucide-react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore, timeAgo } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/notifications")({
  component: Notifications,
  head: () => ({
    meta: [
      { title: "Notifications — CinePilot AI" },
      {
        name: "description",
        content: "Every alert, agent action, and warning across your productions.",
      },
    ],
  }),
});

const iconFor: Record<string, typeof Bell> = {
  risk: AlertTriangle,
  budget: Wallet,
  script: FileText,
  conflict: Users,
  prop: Package,
  done: CheckCircle2,
  weather: Cloud,
};

const colorFor: Record<string, string> = {
  risk: "text-destructive bg-destructive/15",
  budget: "text-warning bg-warning/15",
  script: "text-primary bg-primary/15",
  conflict: "text-warning bg-warning/15",
  prop: "text-info bg-info/15",
  done: "text-success bg-success/15",
  weather: "text-info bg-info/15",
};

function Notifications() {
  const notifications = useStore((s) => s.notifications);
  const markAll = useStore((s) => s.markAllNotificationsRead);
  const markOne = useStore((s) => s.markNotificationRead);

  const unread = notifications.filter((n) => n.unread).length;

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle="Auto-generated whenever projects, scripts, budgets, schedules, or agents change."
        action={
          <div className="flex items-center gap-2">
            <Badge className="gap-1.5 bg-primary/20 text-primary border-primary/30">
              <Bell className="h-3 w-3" /> {unread} unread
            </Badge>
            <Button variant="outline" size="sm" onClick={markAll} disabled={unread === 0}>
              Mark all read
            </Button>
          </div>
        }
      />

      <SectionCard>
        {notifications.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-xs text-muted-foreground">
            No notifications yet. Create a production or run an analysis to generate activity.
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n, i) => {
              const Icon = iconFor[n.type] ?? Bell;
              return (
                <motion.button
                  key={n.id}
                  onClick={() => markOne(n.id)}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={`w-full text-left flex items-start gap-3 rounded-xl border p-3 transition ${
                    n.unread
                      ? "border-primary/30 bg-primary/5"
                      : "border-border/40 bg-white/5"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colorFor[n.type] ?? "text-muted-foreground bg-white/10"}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{n.title}</span>
                      {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{n.message}</div>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{timeAgo(n.createdAt)}</span>
                      <span>·</span>
                      <span className="text-foreground/80">{n.agent}</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </SectionCard>
    </>
  );
}
