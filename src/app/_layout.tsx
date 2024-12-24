import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, View } from "react-native";
import FontProvider from "../providers/FontProvider";
import { ToastProvider } from "react-native-toast-notifications";

export default function RootLayout() {
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
            name="settings"
            options={{ headerShown: true, title: "Settings" }}
          />
        </Stack>
      </FontProvider>
    </ToastProvider>
  );
}
