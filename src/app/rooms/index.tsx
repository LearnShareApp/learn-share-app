import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import LessonItem from "../../components/lesson-item";
import { LESSONS } from "../../../assets/lessons";

const Rooms = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={LESSONS}
        renderItem={(item) => <LessonItem lesson={item.item} />}
        contentContainerStyle={{ gap: 8 }}
      />
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
