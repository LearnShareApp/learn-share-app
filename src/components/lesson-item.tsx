import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { TEACHERS } from "../../assets/teachers";
import { Lesson } from "../../assets/types/lesson";
import SkillBadge from "./skill";

const date1 = new Date("2025-01-22T19:06:00");

const LessonItem = ({ lesson }: { lesson: Lesson }) => {
  const teacher = TEACHERS.find((teacher) => teacher.id === lesson.teacherId);
  if (!teacher) return null;

  const [differenceInSeconds, setDifferenceInSeconds] = useState<number>(0);
  const [differenceText, setDifferenceText] = useState<string>("");

  const checkTime = (dif: number) => {
    if (dif / 60 / 60 / 24 > 1)
      setDifferenceText("in" + (dif / 60 / 60 / 24).toFixed(0) + " days");
    else if (dif / 60 / 60 > 1)
      setDifferenceText("in" + (dif / 60 / 60).toFixed(0) + " hours");
    else if (dif / 60 > 1)
      setDifferenceText("in" + (dif / 60).toFixed(0) + " minutes");
    else setDifferenceText("now");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const date2 = new Date();
      const differenceInMilliseconds = date1.getTime() - date2.getTime();
      setDifferenceInSeconds(differenceInMilliseconds / 1000);
      checkTime(differenceInSeconds);
    }, 600);

    return () => clearInterval(interval);
  }, [date1]);
  return (
    <View style={styles.lesson}>
      <View style={styles.left}>
        <View style={styles.top}>
          <Link href={`/teachers/${teacher.id}`} asChild>
            <Pressable>
              <Image
                source={require("../../assets/icon.png")}
                style={styles.image}
              />
            </Pressable>
          </Link>

          <View style={{ alignItems: "flex-start", gap: 8 }}>
            <Text>
              {teacher.Name} {teacher.Surname}
            </Text>
            <SkillBadge text={lesson.category} />
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          {lesson.status === "ongoing" ? (
            <Text style={{ color: "green" }}>{lesson.status}</Text>
          ) : (
            <>
              <Text style={{ color: "#bbb" }}>{lesson.status + " "}</Text>
              <Text style={{ color: "#bbb" }}>{differenceText}</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.right}>
        {lesson.status === "ongoing" ? (
          <Link href="/rooms/dede" asChild>
            <Pressable style={styles.enter}>
              <Text style={styles.btnText}>Join Lesson</Text>
            </Pressable>
          </Link>
        ) : (
          <Pressable style={styles.noEnter}>
            <Text style={styles.btnText}>Join Lesson</Text>
          </Pressable>
        )}
        <Pressable style={styles.cancel}>
          <Text style={{ color: "#f99" }}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LessonItem;

const styles = StyleSheet.create({
  lesson: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    gap: 8,
    flexDirection: "row",
  },
  left: {
    justifyContent: "space-between",
  },
  top: {
    flexDirection: "row",
    gap: 8,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 50,
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  right: {
    marginLeft: "auto",
    justifyContent: "space-between",
    gap: 4,
  },
  enter: {
    backgroundColor: "#C9A977",
    padding: 8,
    borderRadius: 4,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  noEnter: {
    backgroundColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: { color: "white" },
  cancel: {
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#f99",
    borderRadius: 4,
    padding: 4,
  },
});
