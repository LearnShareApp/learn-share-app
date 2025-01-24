import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import SkillBadge from "./skill";
import { Lesson, TeacherLesson } from "../utilities/api";

export interface LessonMain {
  lesson_id: number;
  user_id: number;
  user_name: string;
  user_surname: string;
  category_id: number;
  category_name: string;
  status: string;
  datatime: Date;
}

const LessonItem = ({
  lesson,
  forTeacher,
  request,
}: {
  lesson: TeacherLesson | Lesson;
  forTeacher?: boolean;
  request?: boolean;
}) => {
  const lessonItemData: LessonMain = {
    lesson_id: lesson.lesson_id,
    user_id: "teacher_id" in lesson ? lesson.teacher_id : lesson.student_id,
    user_name:
      "teacher_id" in lesson ? lesson.teacher_name : lesson.student_name,
    user_surname:
      "teacher_id" in lesson ? lesson.teacher_surname : lesson.student_surname,
    category_id: lesson.category_id,
    category_name: lesson.category_name,
    status: lesson.status,
    datatime: lesson.datatime,
  };

  const date1 = new Date("2025-01-22T21:26:00");

  const [differenceInSeconds, setDifferenceInSeconds] = useState<number>(0);
  const [differenceText, setDifferenceText] = useState<string>("");

  const remainingTime = (dif: number) => {
    if (dif / 60 / 60 / 24 > 1)
      setDifferenceText("in " + (dif / 60 / 60 / 24).toFixed(0) + " days");
    else if (dif / 60 / 60 > 1)
      setDifferenceText("in " + (dif / 60 / 60).toFixed(0) + " hours");
    else if (dif / 60 > 1)
      setDifferenceText("in " + (dif / 60).toFixed(0) + " minutes");
    else setDifferenceText("now");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const date2 = new Date();
      const differenceInMilliseconds = date1.getTime() - date2.getTime();
      setDifferenceInSeconds(differenceInMilliseconds / 1000);
      remainingTime(differenceInSeconds);
    }, 6000);

    return () => clearInterval(interval);
  }, [date1]);
  return (
    <View style={styles.lesson}>
      <View style={styles.left}>
        <View style={styles.top}>
          <Link href={`/teachers/${lessonItemData.user_id}`} asChild>
            <Pressable>
              <Image
                source={require("../../assets/icon.png")}
                style={styles.image}
              />
            </Pressable>
          </Link>

          <View style={{ alignItems: "flex-start", gap: 8 }}>
            {!forTeacher ? <Text>Jason Statham</Text> : <Text>Elon Musk</Text>}
            <SkillBadge text={lessonItemData.category_name} />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 4,
            paddingBottom: 0,
          }}
        >
          {lessonItemData.status === "ongoing" ? (
            <>
              <View style={styles.greenDot} />
              <Text style={{ color: "#8c8" }}>{lessonItemData.status}</Text>
            </>
          ) : (
            <>
              <Text style={{ color: "#bbb" }}>
                {lessonItemData.status + " "}
              </Text>
              <Text style={{ color: "#bbb" }}>{differenceText}</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.right}>
        {request ? (
          <TouchableOpacity activeOpacity={0.6} style={styles.approve}>
            <Text style={styles.btnText}>Прихвати</Text>
          </TouchableOpacity>
        ) : lessonItemData.status === "ongoing" ? (
          <Link href="/rooms/dede" asChild>
            <TouchableOpacity activeOpacity={0.6} style={styles.enter}>
              <Text style={styles.btnText}>Придружите се</Text>
            </TouchableOpacity>
          </Link>
        ) : (
          <View style={styles.noEnter}>
            <Text style={styles.btnText}>Придружите се</Text>
          </View>
        )}

        <TouchableOpacity activeOpacity={0.6} style={styles.cancel}>
          <Text style={{ color: "#f99" }}>
            {forTeacher ? "Одбиј" : "Отказати"}
          </Text>
        </TouchableOpacity>
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
    width: 120,
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
  btnText: { color: "white", textAlign: "center" },
  cancel: {
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#f99",
    borderRadius: 4,
    padding: 8,
    paddingHorizontal: 16,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8c8",
    marginRight: 4,
    paddingTop: 2,
  },
  approve: {
    paddingHorizontal: 16,
    backgroundColor: "#8c8",
    padding: 10,
    borderRadius: 4,
  },
});
