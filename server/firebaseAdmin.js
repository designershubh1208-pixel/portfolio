import admin from "firebase-admin";
import fs from "fs";

let firestore = null;

function loadServiceAccount() {
  const jsonEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (jsonEnv) {
    return JSON.parse(jsonEnv);
  }

  const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (path && fs.existsSync(path)) {
    return JSON.parse(fs.readFileSync(path, "utf-8"));
  }

  return null;
}

export function isFirebaseAdminConfigured() {
  return Boolean(loadServiceAccount());
}

export function getAdminFirestore() {
  if (firestore) return firestore;

  const serviceAccount = loadServiceAccount();
  if (!serviceAccount) return null;

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  firestore = admin.firestore();
  return firestore;
}

export async function saveMessageToFirestore(entry) {
  const db = getAdminFirestore();
  if (!db) return null;

  const ref = await db.collection("messages").add({
    name: entry.name,
    email: entry.email,
    message: entry.message,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    read: false,
    source: "portfolio-api",
  });

  return ref.id;
}
