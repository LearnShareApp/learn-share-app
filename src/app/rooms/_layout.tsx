import { Stack } from "expo-router";
import { useTheme } from "../../providers/theme-provider";
import { useLanguage } from "../../providers/language-provider";

export default function LessonsLayout() {
  const { theme } = useTheme();
  const { t } = useLanguage();
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
        options={{ title: t("your_lessons"), headerShown: true }}
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
