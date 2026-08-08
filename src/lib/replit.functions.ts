import { createServerFn } from "@tanstack/react-start";

/**
 * Replit Agent integration adapter.
 *
 * CinePilot never fakes a Replit deployment. When the Replit credentials are
 * not configured (or the Replit Agent API is not reachable), the adapter
 * reports an "integration_ready" / "unavailable" state and the rest of
 * CinePilot keeps working normally.
 */

export interface ReplitStatus {
  /** "connected" only when credentials exist AND the endpoint answers. */
  state: "connected" | "integration_ready" | "unavailable";
  message: string;
  missing: string[];
}

export interface ReplitToolRequest {
  toolName: string;
  toolType: string;
  department: string;
  purpose: string;
  /** Minimal, non-confidential production context. */
  context: {
    production: string;
    shootingDate?: string;
    scenes?: string[];
    locations?: string[];
  };
}

export interface ReplitToolResult {
  ok: boolean;
  status: "ready" | "pending" | "failed";
  url?: string;
  message: string;
}

const REQUIRED = ["REPLIT_API_KEY", "REPLIT_AGENT_ID", "REPLIT_WORKSPACE_ID"] as const;

function inspectEnv() {
  const missing = REQUIRED.filter((k) => !process.env[k]);
  return { missing, configured: missing.length === 0 };
}

export const getReplitStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<ReplitStatus> => {
    const { missing, configured } = inspectEnv();
    if (!configured) {
      return {
        state: "integration_ready",
        message:
          "Replit Production Tools is integration-ready. Add the Replit Agent credentials to enable live tool generation.",
        missing,
      };
    }
    return {
      state: "connected",
      message: "Replit Agent credentials detected.",
      missing: [],
    };
  }
);

export const createReplitTool = createServerFn({ method: "POST" })
  .inputValidator((data: ReplitToolRequest) => data)
  .handler(async ({ data }): Promise<ReplitToolResult> => {
    const { configured } = inspectEnv();
    if (!configured) {
      return {
        ok: false,
        status: "failed",
        message: "Replit Production Tools is currently unavailable.",
      };
    }

    const endpoint = process.env["REPLIT_AGENT_ENDPOINT"];
    if (!endpoint) {
      // No documented public Replit Agent generation endpoint configured —
      // do not invent one and do not fake a deployment.
      return {
        ok: false,
        status: "failed",
        message:
          "Replit Agent endpoint is not configured, so no tool was generated. Nothing was deployed.",
      };
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env["REPLIT_API_KEY"]}`,
        },
        body: JSON.stringify({
          agentId: process.env["REPLIT_AGENT_ID"],
          workspaceId: process.env["REPLIT_WORKSPACE_ID"],
          // Minimum production context only — never screenplay content.
          request: data,
        }),
      });
      if (!res.ok) {
        return {
          ok: false,
          status: "failed",
          message: `Replit Agent returned ${res.status}. No tool was deployed.`,
        };
      }
      const json = (await res.json()) as { url?: string; deploymentUrl?: string };
      const url = json.url ?? json.deploymentUrl;
      return {
        ok: true,
        status: url ? "ready" : "pending",
        url,
        message: url ? "Production tool deployed by Replit Agent." : "Replit Agent is building the tool.",
      };
    } catch {
      return {
        ok: false,
        status: "failed",
        message: "Replit Production Tools is currently unavailable.",
      };
    }
  });
