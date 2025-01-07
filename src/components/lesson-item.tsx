import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { TEACHERS } from "../../assets/teachers";
import { Lesson } from "../../assets/types/lesson";

const LessonItem = ({ lesson }: { lesson: Lesson }) => {
  const teacher = TEACHERS.find((teacher) => teacher.id === lesson.teacherId);
  if (!teacher) return null;
  return (
    <View style={styles.lesson}>
      <Link href={`/teachers/${teacher.id}`} asChild>
        <Pressable>
          <Image
            source={require("../../assets/icon.png")}
            style={styles.image}
          />
        </Pressable>
      </Link>

      <View>
        <Text>
          {teacher.Name} {teacher.Surname}
        </Text>
        <Text>{lesson.category}</Text>
      </View>

      <View style={{ marginLeft: "auto", alignItems: "center" }}>
        {/* <Text>24$</Text> */}
        {lesson.status === "ongoing" ? (
          <Link href="/rooms/dede" asChild>
            <Pressable>
              <Text style={styles.enter}>Join Lesson</Text>
            </Pressable>
          </Link>
        ) : (
          <Text style={styles.noEnter}>Join Lesson</Text>
        )}
        <Link href="/rooms/dede" asChild>
          <Pressable></Pressable>
        </Link>
        <Text style={{ color: "#bbb" }}>{lesson.status}</Text>
      </View>
    </View>
  );
};

export default LessonItem;

const styles = StyleSheet.create({
  lesson: {
    width: "100%",
    backgroundColor: "white",
    padding: 12,
    flexDirection: "row",
    gap: 8,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  enter: {
    backgroundColor: "#C9A977",
    color: "white",
    padding: 8,
    borderRadius: 4,
  },
  noEnter: {
    backgroundColor: "#bbb",
    color: "white",
    padding: 8,
    borderRadius: 4,
  },
});
