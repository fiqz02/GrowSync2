import React, { useContext } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Alert, ActivityIndicator } from "react-native";
import { AuthContext } from "../../_layout";

export default function TabLayout() {
  const { role } = useContext(AuthContext);

  if (!role) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00008b" />
      </View>
    );
  }

  const checkAccess = (allowedRoles: string[], e: any) => {
    if (!allowedRoles.includes(role)) {
      e.preventDefault();
      Alert.alert(
        "Access Denied",
        "You do not have permission to access this page."
      );
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
        },
        tabBarActiveTintColor: "#00008b",
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          headerTitle: "GrowSync",
          headerStyle: {
            backgroundColor: "#00008b",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "700",
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => checkAccess(["admin", "user"], e),
        })}
      />
      <Tabs.Screen
        name="irrigationControl"
        options={{
          title: "Irrigation Control",
          headerTitle: "GrowSync",
          headerStyle: {
            backgroundColor: "#00008b",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "700",
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "water" : "water-outline"}
              size={24}
              color={color}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => checkAccess(["admin"], e),
        })}
      />
      <Tabs.Screen
        name="graph"
        options={{
          title: "Analytics",
          headerTitle: "GrowSync",
          headerStyle: {
            backgroundColor: "#00008b",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "700",
          },
          tabBarIcon: ({ color }) => (
            <Ionicons name="stats-chart" size={24} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => checkAccess(["admin", "user"], e),
        })}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "Setting",
          headerTitle: "Profile",
          headerStyle: {
            backgroundColor: "#00008b",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "700",
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => checkAccess(["admin", "user"], e),
        })}
      />
    </Tabs>
  );
}
