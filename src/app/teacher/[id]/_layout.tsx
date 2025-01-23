import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="book"
        options={{
          headerShown: true,
          title: "Book Lesson",
        }}
      />
    </Stack>
  );
}
