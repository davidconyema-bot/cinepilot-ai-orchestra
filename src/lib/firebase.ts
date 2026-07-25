import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  type Firestore,
} from "firebase/firestore";

// Firebase Storage is intentionally not used — screenplay files are simulated
// locally and only metadata is persisted (localStorage + optional Firestore).
const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(cfg.apiKey && cfg.projectId);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

if (firebaseEnabled) {
  try {
    app = initializeApp(cfg as Record<string, string>);
    db = getFirestore(app);
  } catch (e) {
    console.warn("[firebase] init failed, falling back to localStorage", e);
  }
}

export async function fbUpsert<T extends { id: string }>(col: string, item: T) {
  if (!db) return;
  try {
    await setDoc(doc(db, col, item.id), item as unknown as Record<string, unknown>);
  } catch (e) {
    console.warn(`[firebase] upsert ${col} failed`, e);
  }
}

export async function fbDelete(col: string, id: string) {
  if (!db) return;
  try {
    await deleteDoc(doc(db, col, id));
  } catch (e) {
    console.warn(`[firebase] delete ${col} failed`, e);
  }
}

export function fbSubscribe<T>(col: string, cb: (items: T[]) => void): () => void {
  if (!db) return () => {};
  try {
    return onSnapshot(collection(db, col), (snap) => {
      cb(snap.docs.map((d) => d.data() as T));
    });
  } catch (e) {
    console.warn(`[firebase] subscribe ${col} failed`, e);
    return () => {};
  }
}
