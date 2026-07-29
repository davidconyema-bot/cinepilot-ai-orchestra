import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { useActorStore } from "@/lib/actor-data";

export const Route = createFileRoute("/_actor/actor/notifications")({
  component: ActorNotifications,
  head: () => ({
    meta: [
      { title: "Notifications — CinePilot Actor Studio" },
      { name: "description", content: "Script updates, scene changes, schedule and wardrobe reminders." },
      { property: "og:title", content: "Notifications — CinePilot Actor Studio" },
      { property: "og:description", content: "Only the alerts that concern you on set." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ActorNotifications() {
  const { notices, markNoticesRead } = useActorStore();
  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle="Everything the production needs you to know."
        action={
          <Button variant="outline" className="gap-2" onClick={markNoticesRead}>
            <Bell className="h-4 w-4" /> Mark all read
          </Button>
        }
      />
      <SectionCard>
        <div className="space-y-2">
          {notices.map((n) => (
            <div
              key={n.id}
              className={`rounded-xl border p-3 ${
                n.unread ? "border-primary/40 bg-primary/5" : "border-border/50 bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{n.title}</span>
                <span className="text-[10px] text-muted-foreground">{n.time}</span>
              </div>
              <p className="text-xs text-muted-foreground">{n.detail}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
