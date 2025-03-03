import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Link, router } from "expo-router";
import SkillBadge from "./skill";
import { apiService, Lesson, TeacherLesson } from "../utilities/api";
import { useLanguage } from "../providers/language-provider";
import { Toast } from "react-native-toast-notifications";
import axios from "axios";
import EventEmitter from "../utilities/event-emitter";
import { useTheme } from "../providers/theme-provider";

export interface LessonMain {
  lesson_id: number;
  user_id: number;
  user_name: string;
  user_surname: string;
  category_id: number;
  category_name: string;
  status: string;
  datetime: Date;
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

  const lessonItemData: LessonMain = useMemo(() => {
    return {
      lesson_id: lesson.lesson_id,
      user_id: "teacher_id" in lesson ? lesson.teacher_id : lesson.student_id,
      user_name:
        "teacher_id" in lesson ? lesson.teacher_name : lesson.student_name,
      user_surname:
        "teacher_id" in lesson
          ? lesson.teacher_surname
          : lesson.student_surname,
      category_id: lesson.category_id,
      category_name: lesson.category_name,
      status: lesson.status,
      datetime: lesson.datetime,
    };
  }, [lesson]);

  const date1 = new Date(lessonItemData.datetime);

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

  const lessonApprove = async () => {
    try {
      await apiService.lessonApprove(lessonItemData.lesson_id);
      Toast.show(t("lesson_approved"), {
        type: "success",
        placement: "top",
        duration: 1500,
      });
      EventEmitter.emit("lessonRemoved", lessonItemData.lesson_id);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || t("an_unknown_error_occurred");
        Toast.show(errorMessage, {
          type: "warning",
          placement: "top",
          duration: 3000,
          swipeEnabled: true,
        });
        console.log(errorMessage);
      } else {
        console.error("Unexpected error:", error);
        Toast.show(t("an_unexpected_error_occurred"), {
          type: "warning",
          placement: "top",
          duration: 3000,
        });
      }
    }
  };

  const lessonCancel = async () => {
    try {
      await apiService.lessonCancel(lessonItemData.lesson_id);
      Toast.show(t("lesson_canceled"), {
        type: "success",
        placement: "top",
        duration: 1500,
      });
      EventEmitter.emit("lessonRemoved", lessonItemData.lesson_id);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || t("an_unknown_error_occurred");
        Toast.show(errorMessage, {
          type: "warning",
          placement: "top",
          duration: 3000,
          swipeEnabled: true,
        });
        console.log(errorMessage);
      } else {
        console.error("Unexpected error:", error);
        Toast.show(t("an_unexpected_error_occurred"), {
          type: "warning",
          placement: "top",
          duration: 3000,
        });
      }
    }
  };

  const [lessonAvailable, setLessonAvailable] = useState<boolean>(false);

  useEffect(() => {
    const checkLessonTime = () => {
      const lessonTime = new Date(lessonItemData.datetime);
      const currentTime = new Date();

      const fiveMinutesBefore = new Date(lessonTime.getTime() - 15 * 60 * 1000);
      const anHourAfter = new Date(lessonTime.getTime() + 60 * 60 * 1000);

      if (
        currentTime.getTime() >= fiveMinutesBefore.getTime() &&
        currentTime.getTime() < anHourAfter.getTime()
      ) {
        setLessonAvailable(true);
      }
    };
    checkLessonTime();
    const interval = setInterval(checkLessonTime, 60 * 1000);

    return () => clearInterval(interval);
  }, [lessonItemData.datetime]);

  const lessonJoin = async () => {
    try {
      const tokenResponse = await apiService.getLessonToken(
        lessonItemData.lesson_id
      );
      Toast.show("connecting..."),
        {
          type: "success",
          placement: "top",
          duration: 1500,
        };
      router.push(
        `/rooms/${tokenResponse}?lesson_id=${
          lessonItemData.lesson_id
        }&user_id=${lessonItemData.user_id}&category=${
          lessonItemData.category_id
        }$is_teacher=${forTeacher ? "1" : "0"}`
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || t("an_unknown_error_occurred");
        Toast.show(errorMessage, {
          type: "warning",
          placement: "top",
          duration: 3000,
          swipeEnabled: true,
        });
        console.log(errorMessage);
      } else {
        console.error("Unexpected error:", error);
        Toast.show(t("an_unexpected_error_occurred"), {
          type: "warning",
          placement: "top",
          duration: 3000,
        });
      }
    }
  };

  const lessonStart = async () => {
    try {
      const startResponse = await apiService.lessonStart(
        lessonItemData.lesson_id
      );
      Toast.show(t("lesson_started"), {
        type: "success",
        placement: "top",
        duration: 1500,
      });

      lessonJoin();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || t("an_unknown_error_occurred");
        Toast.show(errorMessage, {
          type: "warning",
          placement: "top",
          duration: 3000,
          swipeEnabled: true,
        });
        console.log(errorMessage);
      } else {
        console.error("Unexpected error:", error);
        Toast.show(t("an_unexpected_error_occurred"), {
          type: "warning",
          placement: "top",
          duration: 3000,
        });
      }
    }
  };

  return (
    <View style={[styles.lesson, { backgroundColor: theme.colors.card }]}>
      <View style={styles.left}>
        <View style={styles.top}>
          <Link href={`/teachers/${lessonItemData.user_id}`} asChild>
            <Pressable>
              <Image
                source={require("../../assets/icon.jpg")}
                style={styles.image}
              />
            </Pressable>
          </Link>
          <View style={{ alignItems: "flex-start", gap: 8 }}>
            {!forTeacher ? (
              <Text style={{ color: theme.colors.text }}>
                {lessonItemData.user_name} {lessonItemData.user_surname}
              </Text>
            ) : (
              <Text style={{ color: theme.colors.text }}>
                {lessonItemData.user_name} {lessonItemData.user_surname}
              </Text>
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
              <Text style={{ color: "#bbb", flex: 1 }}>
                {lessonItemData.status + " "} {differenceText}
              </Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.right}>
        {request ? (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={lessonApprove}
            style={[styles.approve, { backgroundColor: theme.colors.success }]}
          >
            <Text style={styles.btnText}>{t("approve")}</Text>
          </TouchableOpacity>
        ) : forTeacher &&
          lessonAvailable &&
          lessonItemData.status !== "ongoing" ? (
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              backgroundColor: theme.colors.primary,
              padding: 8,
              borderRadius: 4,
              height: 60,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={lessonStart}
          >
            <Text style={styles.btnText}>{t("start_lesson")}</Text>
          </TouchableOpacity>
        ) : lessonItemData.status === "ongoing" ? (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={lessonJoin}
            style={{
              backgroundColor: theme.colors.primary,
              padding: 8,
              borderRadius: 4,
              height: 60,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.btnText}>{t("join_room")}</Text>
          </TouchableOpacity>
        ) : (
          <View
            style={[styles.noEnter, { backgroundColor: theme.colors.border }]}
          >
            <Text style={styles.btnText}>
              {forTeacher ? t("start_lesson") : t("join_room")}
            </Text>
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.6}
          style={[styles.cancel, { borderColor: theme.colors.error }]}
          onPress={lessonCancel}
        >
          <Text style={{ color: theme.colors.error }}>
            {forTeacher ? t("reject") : t("cancel")}
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
