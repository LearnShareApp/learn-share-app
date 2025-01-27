import { Stack } from "expo-router";
import { useTheme } from "../../providers/theme-provider";

export default function LessonsLayout() {
  const { theme } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          color: theme.colors.text,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Your lessons", headerShown: true }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "lesson",
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      />
    </Stack>
  );
}
