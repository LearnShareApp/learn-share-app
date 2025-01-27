import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Link, Stack } from "expo-router";
import React from "react";
import { useLanguage } from "../providers/language-provider";
import { useTheme } from "../providers/theme-provider";

export default function NotFoundScreen() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  return (
    <>
      <Stack.Screen options={{ title: t("not_found"), headerShown: false }} />
      <View style={styles.container}>
        <Text
          style={{
            color: theme.colors.text,
            textAlign: "center",
            fontSize: 16,
          }}
        >
          {t("not_found")}
        </Text>
        <Link href="/" asChild>
          <TouchableOpacity
            style={{
              width: "auto",
              borderRadius: 4,
              padding: 16,
              backgroundColor: theme.colors.primary,
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
              {t("go_back_home")}
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },

  button: {
    fontSize: 20,
    textDecorationLine: "underline",
  },
});
