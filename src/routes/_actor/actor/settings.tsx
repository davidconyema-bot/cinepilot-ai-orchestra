import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { actorProfile } from "@/lib/actor-data";

export const Route = createFileRoute("/_actor/actor/settings")({
  component: ActorSettings,
  head: () => ({
    meta: [
      { title: "Settings — CinePilot Actor Studio" },
      { name: "description", content: "Notification, availability and privacy preferences for your actor workspace." },
      { property: "og:title", content: "Settings — CinePilot Actor Studio" },
      { property: "og:description", content: "Tune how the production reaches you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const toggles = [
  { id: "script", label: "Script update alerts" },
  { id: "schedule", label: "Schedule change alerts" },
  { id: "notes", label: "Director note alerts" },
  { id: "wardrobe", label: "Wardrobe fitting reminders" },
  { id: "meetings", label: "Production meeting reminders" },
];

function ActorSettings() {
  const [on, setOn] = useState<Record<string, boolean>>(
    Object.fromEntries(toggles.map((t) => [t.id, true])),
  );

  return (
    <>
      <PageHeader title="Settings" subtitle="Control how and when the production contacts you." />
      <div className="grid gap-5 md:grid-cols-2">
        <SectionCard title="Notifications">
          <div className="space-y-2">
            {toggles.map((t) => (
              <button
                key={t.id}
                onClick={() => setOn((s) => ({ ...s, [t.id]: !s[t.id] }))}
                className="flex w-full items-center justify-between rounded-xl border border-border/50 bg-white/5 p-3 text-sm hover:bg-white/10"
              >
                {t.label}
                <span
                  className={`h-5 w-9 rounded-full p-0.5 transition ${on[t.id] ? "bg-primary" : "bg-white/15"}`}
                >
                  <span
                    className={`block h-4 w-4 rounded-full bg-background transition ${on[t.id] ? "translate-x-4" : ""}`}
                  />
                </span>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Account">
          <div className="space-y-2 text-sm">
            <div className="rounded-xl border border-border/50 bg-white/5 p-3">
              <div className="text-[11px] text-muted-foreground">Signed in as</div>
              {actorProfile.email}
            </div>
            <div className="rounded-xl border border-border/50 bg-white/5 p-3">
              <div className="text-[11px] text-muted-foreground">Agency</div>
              {actorProfile.agency}
            </div>
            <Button className="w-full" onClick={() => toast.success("Preferences saved")}>
              Save preferences
            </Button>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
