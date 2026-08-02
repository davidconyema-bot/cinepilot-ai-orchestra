import type { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Keys that survive logout (user preferences only). */
const PRESERVED_KEYS = ["cinepilot-theme", "cinepilot-lang"];

/** Persisted app/session state that must be wiped on logout. */
const WORKSPACE_KEYS = ["cinepilot-store-v1", "cinepilot-collab", "cinepilot-actor"];

export function clearClientSessionData() {
  if (typeof window === "undefined") return;
  try {
    for (const key of WORKSPACE_KEYS) localStorage.removeItem(key);
    // Drop any Supabase auth tokens left behind, keep preferences.
    for (const key of Object.keys(localStorage)) {
      if (PRESERVED_KEYS.includes(key)) continue;
      if (key.startsWith("sb-") || key.startsWith("supabase.")) localStorage.removeItem(key);
    }
    sessionStorage.clear();
  } catch {
    /* storage unavailable */
  }
}

/**
 * Ends the session, clears cached/protected data and sends the user to the
 * public homepage ("/"), never to /auth.
 */
export async function performSignOut(queryClient: QueryClient) {
  await queryClient.cancelQueries();
  queryClient.clear();
  try {
    await supabase.auth.signOut();
  } catch {
    /* already signed out */
  }
  clearClientSessionData();
  // Hard replace so protected pages cannot be restored via the Back button.
  if (typeof window !== "undefined") window.location.replace("/");
}
