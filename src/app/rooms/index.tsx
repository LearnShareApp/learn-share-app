import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import LessonItem from "../../components/lesson-item";

const Rooms = () => {
  return (
    <View style={styles.container}>
      <FlatList data={[3, 3, 3]} renderItem={(item) => <LessonItem />} />
    </View>
  );
};

export default Rooms;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
