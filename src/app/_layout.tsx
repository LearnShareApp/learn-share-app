import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <Stack>
        <Stack.Screen
          name="(main)"
          options={{ headerShown: false, title: "Home" }}
        />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
