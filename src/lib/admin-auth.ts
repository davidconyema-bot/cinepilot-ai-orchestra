// Demo-only admin gate. Do NOT use for real authentication —
// credentials shipped in client code are trivially readable.
const KEY = "cinepilot_admin_session";
export const ADMIN_EMAIL = "davidconyema@gmail.com";
const ADMIN_PASSWORD = "12345678";

export function adminLogin(email: string, password: string): boolean {
  const ok =
    email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
  if (ok && typeof window !== "undefined") {
    sessionStorage.setItem(KEY, "1");
  }
  return ok;
}

export function adminLogout() {
  if (typeof window !== "undefined") sessionStorage.removeItem(KEY);
}

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(KEY) === "1";
}
