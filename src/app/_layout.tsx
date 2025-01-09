import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { useEffect } from "react";
import FontProvider from "../providers/FontProvider";
import { ToastProvider } from "react-native-toast-notifications";

export default function RootLayout() {
  // useEffect(() => {
  //   NavigationBar.setVisibilityAsync("hidden");
  // }, []);

  return (
    <ToastProvider>
      <FontProvider>
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        <Stack>
          <Stack.Screen
            name="(main)"
            options={{ headerShown: false, title: "Home" }}
          />
          <Stack.Screen
            name="auth"
            options={{ headerShown: false, title: "auth" }}
          />
          <Stack.Screen
            name="new-skill"
            options={{ headerShown: true, title: "add your skill" }}
          />
          <Stack.Screen
            name="rooms"
            options={{ headerShown: true, title: "Your Lessons" }}
          />
          <Stack.Screen
            name="settings"
            options={{ headerShown: true, title: "Settings" }}
          />
        </Stack>
      </FontProvider>
    </ToastProvider>
  );
}
