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
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import LessonItem from "../../components/lesson-item";
import HeaderElement from "../../components/header-element";
import { useTeacher } from "../../utilities/teacher-hook";
import { apiService, TeacherLesson } from "../../utilities/api";
import { Toast } from "react-native-toast-notifications";
import { useLanguage } from "../../providers/language-provider";
import { useTheme } from "../../providers/theme-provider";

const Teaching = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { teacher, loadingTeacher, errorTeacher } = useTeacher();

  const [lessons, setLessons] = useState<TeacherLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const response = await apiService.getTeacherLessons();
        setLessons(response || []);
      } catch (err) {
        console.error("Error details:", err);
        setError(t("failed_fetch_teachers"));
        Toast.show(t("failed_load_teachers"), {
          type: "error",
          placement: "top",
          duration: 3000,
        });
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [teacher]);

  if (loadingTeacher) {
    return <HeaderElement text="Loading..." requireChanges requireSettings />;
  }

  if (teacher)
    return (
      <>
        <HeaderElement text={t("teaching")} requireChanges requireSettings />
        <View
          style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 8, gap: 8, backgroundColor: theme.colors.background }}
        >
          <View style={styles.topNav}>
            <Link href={"/requests"} asChild>
            <Pressable style={{
                width: "48%",
                minHeight: 32,
                borderRadius: 8,
                padding: 16,
                gap: 8,
                alignItems: "center",
                backgroundColor: theme.colors.card }}>
                <FontAwesome
                  size={24}
                  name="bell"
                  style={{ color: "#C9A977" }}
                />
                <Text style={{ textAlign: "center", color: theme.colors.text }}>
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
              <Pressable style={{
                width: "48%",
                minHeight: 32,
                borderRadius: 8,
                padding: 16,
                gap: 8,
                alignItems: "center",
                backgroundColor: theme.colors.card
              }}>
                <FontAwesome
                  size={24}
                  name="calendar"
                  style={{ color: "#C9A977" }}
                />
                <Text style={{ textAlign: "center", color: theme.colors.text }}>{t("my_schedule")}</Text>
              </Pressable>
            </Link>
          </View>
          <Link href={"/stats"} asChild>
            <Pressable style={{
              width: "100%",
              borderRadius: 8,
              padding: 24,
              gap: 12,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: theme.colors.card
            }}>
              <FontAwesome
                size={24}
                name="pie-chart"
                style={{ color: "#C9A977" }}
              />
              <Text style={{ textAlign: "center", color: theme.colors.text }}>{t("manage_skills")}</Text>
            </Pressable>
          </Link>
          <Text style={{ fontSize: 20, paddingHorizontal: 16, color: theme.colors.text }}>
            {t("next_lesson")}:
          </Text>

          {lessons.filter((lesson) => lesson.status != "verification")
            .length ? (
            <FlatList
              data={lessons.filter((lesson) => lesson.status != "verification")}
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
