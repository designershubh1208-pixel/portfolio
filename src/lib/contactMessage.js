import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirestoreDb, isFirebaseConfigured } from "./firebase";

export async function sendContactMessage({ name, email, message }) {
  const payload = {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
  };

  if (isFirebaseConfigured()) {
    const db = getFirestoreDb();
    if (!db) {
      throw new Error("Firebase is not initialized.");
    }

    const docRef = await addDoc(collection(db, "messages"), {
      ...payload,
      createdAt: serverTimestamp(),
      read: false,
      source: "portfolio",
    });

    return { ok: true, id: docRef.id, channel: "firebase" };
  }

  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }

  return { ok: true, id: data.id, channel: data.channel || "api" };
}
