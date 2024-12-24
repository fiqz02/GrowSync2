import React, { useContext, useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Slot, useRouter } from "expo-router";
import { useColorScheme } from "@/components/useColorScheme";
import { auth } from "../firebase.config";
import { ref, get } from "firebase/database";
import { database } from "../firebase.config";
import { User } from "firebase/auth";
import { Text, View, Alert } from "react-native";

// Import FCM utilities
import { initializeFCM, subscribeToFCMTopic } from "../utils/fcmService";

// Exporting AuthContext for use in other components like TabLayout
export const AuthContext = React.createContext<{
  user: User | null;
  role: string | null;
}>({ user: null, role: null });

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const roleRef = ref(database, `users/${currentUser.uid}/role`);
          const roleSnapshot = await get(roleRef);
          setRole(roleSnapshot.exists() ? roleSnapshot.val() : "user");
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole("user"); // Default to "user" if error occurs
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={{ user, role }}>
      {children}
    </AuthContext.Provider>
  );
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Loading...</Text>
    </View>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user } = useContext(AuthContext);
  const router = useRouter();

  // Initialize FCM
  useEffect(() => {
    const setupFCM = async () => {
      try {
        await initializeFCM(); // Initialize FCM for permissions and notifications
        await subscribeToFCMTopic("sensor-alerts"); // Subscribe to topic for sensor alerts
      } catch (error) {
        console.error("Error setting up FCM:", error);
      }
    };

    if (user) {
      setupFCM();
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.replace("/(auth)/authentication"); // Redirect to login
    } else {
      router.replace("/(auth)/(tabs)/dashboard");
    }
  }, [user]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* Slot ensures child routes are rendered correctly */}
      <Slot />
    </ThemeProvider>
  );
}
