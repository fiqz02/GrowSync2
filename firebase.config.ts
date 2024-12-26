import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getMessaging, isSupported } from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5CaRC6JOT1czTvz-mNtfpCgfIyKmg-nc",
  authDomain: "growsync-e8713.firebaseapp.com",
  databaseURL: "https://growsync-e8713-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "growsync-e8713",
  storageBucket: "growsync-e8713.appspot.com",
  messagingSenderId: "329464030712",
  appId: "1:329464030712:web:1b414e8c50989f73de220d",
};

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const database = getDatabase(app);
const auth = getAuth(app);

// Initialize Firebase Messaging with async support check
let messaging: ReturnType<typeof getMessaging> | null = null;

(async () => {
  const supported = await isSupported();
  if (supported) {
    messaging = getMessaging(app);
    console.log("Firebase Messaging is supported.");
  } else {
    console.warn("Firebase Messaging is not supported in this environment.");
  }
})();

// Export Firebase services
export { app, database, auth, messaging };
