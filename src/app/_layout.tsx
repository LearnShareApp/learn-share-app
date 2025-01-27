import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { useEffect } from "react";
import { ToastProvider } from "react-native-toast-notifications";
import { AuthProvider } from "../providers/auth-provider";
import { LanguageProvider, useLanguage } from "../providers/language-provider";
import { ThemeProvider, useTheme } from "../providers/theme-provider";
import * as SecureStore from "expo-secure-store";

const StackNavigator = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          color: theme.colors.text,
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
          flex: 1,
        },
      }}
    >
      <Stack.Screen
        name="(main)"
        options={{
          headerShown: false,
          title: "Home",
        }}
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
        options={{
          headerShown: true,
          title: "add your skill",
        }}
      />
      <Stack.Screen
        name="requests"
        options={{ headerShown: true, title: t("new_requests") }}
      />
      <Stack.Screen
        name="stats"
        options={{ headerShown: true, title: t("your_skills") }}
      />
      <Stack.Screen
        name="rooms"
        options={{ headerShown: false, title: t("your_lessons") }}
      />
      <Stack.Screen
        name="settings"
        options={{ headerShown: true, title: t("settings") }}
      />
      <Stack.Screen
        name="teacher"
        options={{ headerShown: false, title: t("teacher_profile") }}
      />
      <Stack.Screen
        name="schedule"
        options={{ headerShown: true, title: t("my_schedule") }}
      />
      <Stack.Screen
        name="about"
        options={{ headerShown: true, title: t("about") }}
      />
    </Stack>
  );
};

export default function RootLayout() {
  useEffect(() => {
    const setupNavigationBar = async () => {
      if (Platform.OS === "android") {
        try {
          const savedTheme = await SecureStore.getItemAsync("user_theme");
          if (savedTheme === "dark") {
            await NavigationBar.setBackgroundColorAsync("#000000");
            await NavigationBar.setButtonStyleAsync("light");
          } else {
            await NavigationBar.setBackgroundColorAsync("#FFFFFF");
            await NavigationBar.setButtonStyleAsync("dark");
          }
        } catch (error) {
          console.warn("NavigationBar customization is not available:", error);
        }
      }
    };

    setupNavigationBar();
  }, []);

  return (
    <LanguageProvider>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <StatusBar style="auto" />
            <StackNavigator />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
