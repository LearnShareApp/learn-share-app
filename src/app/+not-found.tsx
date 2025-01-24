import { View, StyleSheet } from "react-native";
import { Link, Stack } from "expo-router";
import React from "react";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops! Not Found" }} />
      <View style={styles.container}>
        <Link href="/" style={styles.button}>
          Вратите се на почетни екран!
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
  },

  button: {
    fontSize: 20,
    textDecorationLine: "underline",
  },
});
