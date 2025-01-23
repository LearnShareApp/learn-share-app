import { Stack } from "expo-router";

export default function LessonsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Your lessons", headerShown: false }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: "lesson", headerShown: false }}
      />
    </Stack>
  );
}
