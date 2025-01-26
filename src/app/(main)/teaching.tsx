import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import LessonItem from "../../components/lesson-item";
import HeaderElement from "../../components/header-element";
import { useTeacher } from "../../utilities/teacher-hook";
import { apiService, TeacherLesson } from "../../utilities/api";
import { Toast } from "react-native-toast-notifications";
import { useLanguage } from "../../providers/language-provider";
import { useFocusEffect } from '@react-navigation/native';
import EventEmitter from "../../utilities/event-emitter";

const Teaching = () => {
  const { t } = useLanguage();
  const { teacher, loadingTeacher, errorTeacher } = useTeacher();

  const [lessons, setLessons] = useState<TeacherLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTeacherLessons();
      const sortedLessons = response.sort((a, b) => {
        const dateA = new Date(a.datetime);
        const dateB = new Date(b.datetime);
        return dateA.getTime() - dateB.getTime();
      });
      setLessons(sortedLessons || []);
    } catch (err) {
      console.error("Error details:", err);
      setError(t("failed_fetch_teachers"));
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  // Обновление при фокусе на экране
  useFocusEffect(
    useCallback(() => {
      fetchLessons();
    }, [teacher])
  );

  // Периодическое обновление каждые 30 секунд
  useEffect(() => {
    fetchLessons();
    
    const interval = setInterval(() => {
      fetchLessons();
    }, 30000);

    return () => clearInterval(interval);
  }, [teacher]);

  // Подписка на событие обновления уроков
  useEffect(() => {
    const subscription = EventEmitter.addListener('lessonsUpdated', () => {
      fetchLessons();
    });

    return () => subscription.remove();
  }, [teacher]);

  if (loadingTeacher) {
    return <HeaderElement text="Loading..." requireChanges requireSettings />;
  }

  if (teacher)
    return (
      <>
        <HeaderElement text={t("teaching")} requireChanges requireSettings />
        <View
          style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 8, gap: 8 }}
        >
          <View style={styles.topNav}>
            <Link href={"/requests"} asChild>
              <Pressable style={styles.navBtn}>
                <FontAwesome
                  size={24}
                  name="bell"
                  style={{ color: "#C9A977" }}
                />
                <Text style={{ textAlign: "center" }}>
                  {t("new_requests")} (
                  {
                    lessons.filter((lesson) => lesson.status == "verification")
                      .length
                  }
                  )
                </Text>
              </Pressable>
            </Link>

            <Link href={"/schedule"} asChild>
              <Pressable style={styles.navBtn}>
                <FontAwesome
                  size={24}
                  name="calendar"
                  style={{ color: "#C9A977" }}
                />
                <Text style={{ textAlign: "center" }}>{t("my_schedule")}</Text>
              </Pressable>
            </Link>
          </View>
          <Link href={"/stats"} asChild>
            <Pressable style={styles.navBtnSkills}>
              <FontAwesome
                size={24}
                name="pie-chart"
                style={{ color: "#C9A977" }}
              />
              <Text style={{ textAlign: "center" }}>{t("manage_skills")}</Text>
            </Pressable>
          </Link>
          <Text style={{ fontSize: 20, paddingHorizontal: 16 }}>
            {t("next_lesson")}:
          </Text>

          {lessons.filter((lesson) => lesson.status !== "verification" && lesson.status !== "cancelled")
            .length ? (
            <FlatList
              data={lessons.filter((lesson) => lesson.status !== "verification" && lesson.status !== "cancelled")}
              renderItem={(item) => (
                <LessonItem lesson={item.item} forTeacher />
              )}
              contentContainerStyle={{ gap: 8 }}
            />
          ) : (
            <View
              style={{
                flex: 1,
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ textAlign: "center", color: "#999" }}>
                {t("no_lessons")}
              </Text>
            </View>
          )}
        </View>
      </>
    );
  return (
    <>
      <HeaderElement text="Teaching" requireChanges requireSettings />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.card]}>
          <View style={styles.imagePart}>
            <Image
              source={require("../../../assets/teach1.png")}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textPart}>
            <Text style={styles.cardText}>{t("teach_welcome")}</Text>
            <Text>{t("teach_intro")}</Text>
          </View>
        </View>

        <View style={[styles.card]}>
          <View style={styles.imagePart}>
            <Image
              source={require("../../../assets/teach2.png")}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textPart}>
            <Text style={styles.cardText}>{t("teach_step1")}</Text>
            <Text>{t("teach_step1_desc")}</Text>
          </View>
        </View>

        <View style={[styles.card]}>
          <View style={styles.imagePart}>
            <Image
              source={require("../../../assets/teach3.png")}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textPart}>
            <Text style={styles.cardText}>{t("teach_step2")}</Text>
            <Text>{t("teach_step2_desc")}</Text>
          </View>
        </View>

        <View style={[styles.card]}>
          <View style={styles.imagePart}>
            <Image
              source={require("../../../assets/teach4.png")}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textPart}>
            <Text style={styles.cardText}>{t("teach_step3")}</Text>
            <Text>{t("teach_step3_desc")}</Text>
          </View>
        </View>

        <Link href={"/new-skill"} asChild>
          <TouchableOpacity activeOpacity={0.6} style={styles.btn}>
            <Text style={styles.text}>{t("start_sharing")}</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </>
  );
};

export default Teaching;

const styles = StyleSheet.create({
  container: {
    gap: 16,
    alignItems: "center",
    paddingBottom: 24,
  },
  btn: {
    padding: 16,
    marginVertical: 32,
    backgroundColor: "#C9A977",
    borderRadius: 8,
  },
  text: {
    textAlign: "center",
    verticalAlign: "middle",
    color: "white",
    fontSize: 24,
  },
  card: {
    backgroundColor: "white",
    minHeight: 64,
    borderRadius: 8,
    width: "80%",
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  navBtn: {
    width: "48%",
    backgroundColor: "white",
    minHeight: 32,
    borderRadius: 8,
    padding: 16,
    gap: 8,
    alignItems: "center",
  },
  navBtnSkills: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 24,
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  imagePart: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  textPart: {
    padding: 16,
  },
  cardText: {
    fontSize: 18,
  },
});
