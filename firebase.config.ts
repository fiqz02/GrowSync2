import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD5CaRC6JOT1czTvz-mNtfpCgfIyKmg-nc",
  authDomain: "growsync-e8713.firebaseapp.com",
  databaseURL: "https://growsync-e8713-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "growsync-e8713",
  storageBucket: "growsync-e8713.appspot.com",
  messagingSenderId: "329464030712",
  appId: "1:329464030712:web:1b414e8c50989f73de220d",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);
const auth = initializeAuth(app, {persistence: getReactNativePersistence(AsyncStorage)});

export { app, database, auth };
