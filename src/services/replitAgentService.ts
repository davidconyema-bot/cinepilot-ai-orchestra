/**
 * Replit Agent service layer for CinePilot AI.
 *
 * Responsibilities:
 *  - Replit configuration + integration handling (via server functions only)
 *  - Production context preparation (minimum necessary data)
 *  - Tool generation requests + generated tool status
 *  - Deployment URL handling
 *  - Error handling (never fakes success)
 *
 * No API keys ever live in frontend code — credentials are read server-side
 * from REPLIT_API_KEY / REPLIT_AGENT_ID / REPLIT_WORKSPACE_ID.
 */
import {
  createReplitTool,
  getReplitStatus,
  type ReplitStatus,
  type ReplitToolRequest,
  type ReplitToolResult,
} from "@/lib/replit.functions";
import type { Production, ShootDay } from "@/lib/store";

export type { ReplitStatus, ReplitToolRequest, ReplitToolResult };

export const REPLIT_AGENT = {
  id: "replit",
  name: "Replit Production Tools Agent",
  provider: "Replit",
  technology: "Replit Agent",
  category: "Production Utility Builder",
  description:
    "Builds lightweight production utilities for crews, departments and production teams using Replit Agent.",
  capabilities: [
    "Crew check-in tools",
    "Location scouting forms",
    "Props inventory tools",
    "Costume tracking tools",
    "Equipment checkout tools",
    "Crew availability forms",
    "Production feedback forms",
    "Call-sheet portals",
    "Location permission trackers",
    "Department-specific utility dashboards",
  ],
} as const;

export interface ToolBlueprint {
  toolName: string;
  toolType: string;
  department: string;
  purpose: string;
}

/** Lightweight intent detection — decides if a request is a production utility. */
const INTENTS: Array<{ match: RegExp; blueprint: ToolBlueprint }> = [
  {
    match: /crew\s*(check[- ]?in|checkin)|check[- ]?in portal/i,
    blueprint: {
      toolName: "Crew Check-In Portal",
      toolType: "crew_check_in",
      department: "Production",
      purpose: "Let crew check in on set and track daily attendance.",
    },
  },
  {
    match: /prop/i,
    blueprint: {
      toolName: "Props Inventory Tracker",
      toolType: "props_inventory",
      department: "Props",
      purpose: "Track props per scene, condition and location.",
    },
  },
  {
    match: /location (scout|scouting)|scouting form|location permission/i,
    blueprint: {
      toolName: "Location Scouting Form",
      toolType: "location_scouting",
      department: "Locations",
      purpose: "Capture location photos, access notes and permission status.",
    },
  },
  {
    match: /costume|wardrobe/i,
    blueprint: {
      toolName: "Costume Tracking Tool",
      toolType: "costume_tracking",
      department: "Costume",
      purpose: "Track costume continuity, fittings and returns.",
    },
  },
  {
    match: /equipment (checkout|check[- ]?out)|gear checkout/i,
    blueprint: {
      toolName: "Equipment Checkout Tracker",
      toolType: "equipment_checkout",
      department: "Camera & Grip",
      purpose: "Log equipment out and back in per shoot day.",
    },
  },
  {
    match: /crew availability|availability form/i,
    blueprint: {
      toolName: "Crew Availability Form",
      toolType: "crew_availability",
      department: "Production",
      purpose: "Collect crew availability for upcoming shoot days.",
    },
  },
  {
    match: /call[- ]?time|call sheet portal|confirm their call/i,
    blueprint: {
      toolName: "Call-Time Confirmation Portal",
      toolType: "call_time_portal",
      department: "Assistant Directing",
      purpose: "Let cast and crew confirm their call times.",
    },
  },
  {
    match: /feedback form|production feedback/i,
    blueprint: {
      toolName: "Production Feedback Form",
      toolType: "production_feedback",
      department: "Production",
      purpose: "Collect anonymous crew feedback during the shoot.",
    },
  },
];

const BUILD_VERB = /\b(create|build|generate|make|set up|spin up)\b/i;
const TOOL_NOUN = /\b(tool|portal|form|tracker|inventory|checkout|dashboard|check[- ]?in)\b/i;

/** Returns a blueprint when the request should be delegated to Replit. */
export function detectProductionTool(text: string): ToolBlueprint | null {
  if (!BUILD_VERB.test(text) || !TOOL_NOUN.test(text)) return null;
  const hit = INTENTS.find((i) => i.match.test(text));
  if (hit) return hit.blueprint;
  return {
    toolName: "Custom Production Utility",
    toolType: "custom_utility",
    department: "Production",
    purpose: text.trim().slice(0, 160),
  };
}

/** Minimum production context — never includes screenplay content. */
export function buildProductionContext(
  production?: Pick<Production, "title"> | null,
  shootDay?: Pick<ShootDay, "date" | "scenes" | "location"> | null
): ReplitToolRequest["context"] {
  return {
    production: production?.title ?? "Untitled Production",
    ...(shootDay?.date ? { shootingDate: shootDay.date } : {}),
    ...(shootDay?.scenes?.length ? { scenes: shootDay.scenes } : {}),
    ...(shootDay?.location ? { locations: [shootDay.location] } : {}),
  };
}

export async function fetchReplitStatus(): Promise<ReplitStatus> {
  try {
    return await getReplitStatus();
  } catch {
    return {
      state: "unavailable",
      message: "Replit Production Tools is currently unavailable.",
      missing: [],
    };
  }
}

export async function requestProductionTool(
  req: ReplitToolRequest
): Promise<ReplitToolResult> {
  try {
    return await createReplitTool({ data: req });
  } catch {
    return {
      ok: false,
      status: "failed",
      message: "Replit Production Tools is currently unavailable.",
    };
  }
}
