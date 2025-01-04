import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const LessonItem = () => {
  return (
    <Link href="/rooms/dede" asChild>
      <Pressable style={styles.lesson}>
        <Text>Your lesson</Text>
      </Pressable>
    </Link>
  );
};

export default LessonItem;

const styles = StyleSheet.create({
  lesson: {
    width: "100%",
    backgroundColor: "white",
    padding: 10,
  },
});
