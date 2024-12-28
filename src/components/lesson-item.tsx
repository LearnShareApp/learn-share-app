import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const LessonItem = () => {
  return (
    <Link href="/rooms/dede">
      <Text>Your lesson</Text>
    </Link>
  );
};

export default LessonItem;

const styles = StyleSheet.create({});
