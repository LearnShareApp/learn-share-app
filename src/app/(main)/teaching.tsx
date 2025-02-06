import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
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
import { useLanguage } from "../../providers/language-provider";
import { useFocusEffect } from "@react-navigation/native";
import EventEmitter from "../../utilities/event-emitter";
import { useTheme } from "../../providers/theme-provider";
import { useRefresh } from "../../providers/refresh-provider";

const Teaching = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { teacher, loadingTeacher, errorTeacher, refetch } = useTeacher();

  const [lessons, setLessons] = useState<TeacherLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { refreshing, setRefreshing } = useRefresh();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const fetchLessons = useCallback(async () => {
    try {
      refetch();
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
  }, []);

  // Обновление при фокусе на экране
  useFocusEffect(
    useCallback(() => {
      fetchLessons();
    }, [])
  );

  useEffect(() => {
    const subscription = EventEmitter.addListener("lessonsUpdated", () => {
      fetchLessons();
    });

    return () => subscription.remove();
  }, []);

  if (loadingTeacher) {
    return (
      <>
        <HeaderElement text="Loading..." requireChanges requireSettings />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.background,
          }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </>
    );
  }

  if (teacher)
    return (
      <>
        <HeaderElement text={t("teaching")} requireChanges requireSettings />
        <FlatList
          ListHeaderComponentStyle={{
            paddingHorizontal: 8,
            gap: 8,
          }}
          ListHeaderComponent={
            <>
              <View style={styles.topNav}>
                <Link href={"/requests"} asChild>
                  <Pressable style={styles.navButton}>
                    <FontAwesome
                      size={24}
                      name="bell"
                      style={{ color: "#C9A977" }}
                    />
                    <Text
                      style={{ textAlign: "center", color: theme.colors.text }}
                    >
                      {t("new_requests")} (
                      {
                        lessons.filter(
                          (lesson) => lesson.status == "verification"
                        ).length
                      }
                      )
                    </Text>
                  </Pressable>
                </Link>

                <Link href={"/schedule"} asChild>
                  <Pressable style={styles.navButton}>
                    <FontAwesome
                      size={24}
                      name="calendar"
                      style={{ color: "#C9A977" }}
                    />
                    <Text
                      style={{ textAlign: "center", color: theme.colors.text }}
                    >
                      {t("my_schedule")}
                    </Text>
                  </Pressable>
                </Link>
              </View>
              <Link href={"/stats"} asChild>
                <Pressable style={styles.statsButton}>
                  <FontAwesome
                    size={24}
                    name="pie-chart"
                    style={{ color: "#C9A977" }}
                  />
                  <Text
                    style={{ textAlign: "center", color: theme.colors.text }}
                  >
                    {t("manage_skills")}
                  </Text>
                </Pressable>
              </Link>
              <Text
                style={{
                  fontSize: 20,
                  paddingHorizontal: 16,
                  color: theme.colors.text,
                }}
              >
                {t("next_lesson")}:
              </Text>
            </>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={lessons.filter(
            (lesson) =>
              lesson.status !== "verification" &&
              lesson.status !== "cancelled" &&
              lesson.status !== "finished"
          )}
          renderItem={({ item }) => <LessonItem lesson={item} forTeacher />}
          contentContainerStyle={{ gap: 8 }}
          ListEmptyComponent={
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
          }
        />
      </>
    );
  return (
    <>
      <HeaderElement text="Teaching" requireChanges requireSettings />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <View style={styles.imagePart}>
            <Image
              source={require("../../../assets/teach1.png")}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textPart}>
            <Text style={[styles.cardText, { color: theme.colors.text }]}>
              {t("teach_welcome")}
            </Text>
            <Text style={{ color: theme.colors.text }}>{t("teach_intro")}</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <View style={styles.imagePart}>
            <Image
              source={require("../../../assets/teach2.png")}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textPart}>
            <Text style={[styles.cardText, { color: theme.colors.text }]}>
              {t("teach_step1")}
            </Text>
            <Text style={{ color: theme.colors.text }}>
              {t("teach_step1_desc")}
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <View style={styles.imagePart}>
            <Image
              source={require("../../../assets/teach3.png")}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textPart}>
            <Text style={[styles.cardText, { color: theme.colors.text }]}>
              {t("teach_step2")}
            </Text>
            <Text style={{ color: theme.colors.text }}>
              {t("teach_step2_desc")}
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <View style={styles.imagePart}>
            <Image
              source={require("../../../assets/teach4.png")}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textPart}>
            <Text style={[styles.cardText, { color: theme.colors.text }]}>
              {t("teach_step3")}
            </Text>
            <Text style={{ color: theme.colors.text }}>
              {t("teach_step3_desc")}
            </Text>
          </View>
        </View>

        <Link href={"/new-skill"} asChild>
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              backgroundColor: theme.colors.primary,
              padding: 16,
              marginVertical: 32,
              borderRadius: 8,
            }}
          >
            <Text style={[styles.text, { color: "white" }]}>
              {t("start_sharing")}
            </Text>
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
  navButton: {
    flex: 1,
    minHeight: 32,
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    backgroundColor: "white",
  },
  statsButton: {
    width: "100%",
    borderRadius: 8,
    padding: 24,
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
});
