import { Stack } from "expo-router";
import { useLanguage } from "../../providers/language-provider";
import { useTheme } from "../../providers/theme-provider";

export default function Layout() {
  const { t } = useLanguage();
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
        name="[id]"
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="book"
        options={{
          headerShown: true,
          title: t("book_lesson"),
        }}
      />
    </Stack>
  );
}
