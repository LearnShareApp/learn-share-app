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
import { useLanguage } from "../providers/language-provider";
import { useTheme } from "../providers/theme-provider";

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
  const { t } = useLanguage();
  const { theme } = useTheme();

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
    <View style={[styles.lesson, { backgroundColor: theme.colors.card }]}>
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
            {!forTeacher ? (
              <Text style={{ color: theme.colors.text }}>Jason Statham</Text>
            ) : (
              <Text style={{ color: theme.colors.text }}>Elon Musk</Text>
            )}
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
              <Text style={{ color: theme.colors.success }}>
                {lessonItemData.status}
              </Text>
            </>
          ) : (
            <>
              <Text style={{ color: theme.colors.text }}>
                {lessonItemData.status + " "}
              </Text>
              <Text style={{ color: theme.colors.text }}>{differenceText}</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.right}>
        {request ? (
          <TouchableOpacity activeOpacity={0.6} style={[styles.approve, { backgroundColor: theme.colors.success }]}>
            <Text style={styles.btnText}>{t("approve")}</Text>
          </TouchableOpacity>
        ) : lessonItemData.status === "ongoing" ? (
          <Link href="/rooms/dede" asChild>
            <TouchableOpacity activeOpacity={0.6} style={[styles.enter, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.btnText}>{t("join_room")}</Text>
            </TouchableOpacity>
          </Link>
        ) : (
          <View style={[styles.noEnter, { backgroundColor: theme.colors.border }]}>
            <Text style={styles.btnText}>{t("join_room")}</Text>
          </View>
        )}

        <TouchableOpacity activeOpacity={0.6} style={[styles.cancel, { borderColor: theme.colors.error }]}>
          <Text style={{ color: theme.colors.error }}>
            {forTeacher ? t("reject") : t("reject")}
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
  right: {
    marginLeft: "auto",
    justifyContent: "space-between",
    gap: 4,
    width: 120,
  },
  enter: {
    padding: 8,
    borderRadius: 4,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  noEnter: {
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
    borderRadius: 4,
    padding: 8,
    paddingHorizontal: 16,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
    paddingTop: 2,
  },
  approve: {
    paddingHorizontal: 16,
    padding: 10,
    borderRadius: 4,
  },
});
