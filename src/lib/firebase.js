import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

function getFirebaseConfig() {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  if (!projectId) return null;

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
}

export function isFirebaseConfigured() {
  return Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID);
}

export function getFirestoreDb() {
  const config = getFirebaseConfig();
  if (!config) return null;

  const app = getApps().length ? getApps()[0] : initializeApp(config);
  return getFirestore(app);
}
