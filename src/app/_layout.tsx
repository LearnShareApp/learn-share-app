import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(main)"
        options={{ headerShown: false, title: "Home" }}
      />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
    </Stack>
  );
}
