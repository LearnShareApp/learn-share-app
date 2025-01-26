import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { useEffect } from "react";
import { ToastProvider } from "react-native-toast-notifications";
import { AuthProvider } from "../providers/auth-provider";
import { LanguageProvider } from "../providers/language-provider";

export default function RootLayout() {
  useEffect(() => {
    //   NavigationBar.setVisibilityAsync("hidden");
  }, []);

  return (
    <LanguageProvider>
      <ToastProvider>
        <AuthProvider>
          <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
          <Stack>
            <Stack.Screen
              name="(main)"
              options={{ headerShown: false, title: "Home" }}
            />
            <Stack.Screen
              name="sign-in"
              options={{ headerShown: false, title: "auth" }}
            />
            <Stack.Screen
              name="sign-up"
              options={{ headerShown: false, title: "sign-up" }}
            />
            <Stack.Screen
              name="new-skill"
              options={{ headerShown: true, title: "add your skill" }}
            />
            <Stack.Screen
              name="requests"
              options={{ headerShown: true, title: "New requests" }}
            />
            <Stack.Screen
              name="stats"
              options={{ headerShown: true, title: "Your stats" }}
            />
            <Stack.Screen
              name="rooms"
              options={{ headerShown: false, title: "Your Lessons" }}
            />
            <Stack.Screen
              name="settings"
              options={{ headerShown: true, title: "Settings" }}
            />
            <Stack.Screen
              name="teacher"
              options={{ headerShown: false, title: "Settings" }}
            />
            <Stack.Screen
              name="schedule"
              options={{ headerShown: true, title: "My schedule" }}
            />
            <Stack.Screen
              name="about"
              options={{ headerShown: true, title: "About" }}
            />
          </Stack>
        </AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
