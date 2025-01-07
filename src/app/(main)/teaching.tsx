import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Teaching = () => {
  return (
    <View style={styles.container}>
      <Text>Want not only to be teached?</Text>
      <Link href={"/"} asChild>
        <Pressable style={styles.btn}>
          <Text style={styles.text}>Start sharing my skills</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default Teaching;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btn: {
    padding: 16,
    backgroundColor: "#C9A977",
    borderRadius: 8,
  },
  text: {
    textAlign: "center",
    verticalAlign: "middle",
    color: "white",
    fontSize: 20,
  },
});
