import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import SkillBadge from "../../components/skill";
import YouTubeIframe from "react-native-youtube-iframe";
import { FontAwesome } from "@expo/vector-icons";
import Line from "../../components/line";
import ReviewItem from "../../components/review-item";
import { apiService, TeacherProfile } from "../../utilities/api";
import { useLanguage } from "../../providers/language-provider";
import { useTheme } from "../../providers/theme-provider";
import { useAvatar } from "../../utilities/avatar-hook";
import YouTubeVideo from "../../components/youtube-video";
import { useRefresh } from "../../providers/refresh-provider";
type FontAwesomeIconName = "star" | "graduation-cap" | "user";

const TeacherProfilePage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { t } = useLanguage();
  const { theme } = useTheme();

  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { refreshing, setRefreshing } = useRefresh();

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTeacher();
    setRefreshing(false);
  };

  const { avatarSource, loadingAvatar } = useAvatar(teacher?.avatar ?? null);

  const fetchTeacher = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTeacherById(id);
      if (!response) {
        throw new Error("Teacher not found");
      }
      setTeacher(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch teacher";
      setError(errorMessage);
      console.error("Error details:", err);
      router.replace("/404");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacher();
  }, [id]);

  if (loading) {
    return (
      <View
        style={[
          styles.centerContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !teacher) {
    return (
      <View
        style={[
          styles.centerContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={{ color: theme.colors.text }}>
          Error: {error || "Teacher not found"}
        </Text>
      </View>
    );
  }

  const videoId =
    teacher?.skills[0].video_card_link.length > 14
      ? teacher?.skills[0].video_card_link.split("v=")[1]?.split("&")[0]
      : teacher?.skills[0].video_card_link ?? "";

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Stack.Screen
        options={{
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
          title: `${teacher.name} ${teacher.surname}`,
          headerRight: () => (
            <TouchableOpacity
              activeOpacity={0.6}
              style={[
                styles.bookBtn,
                { backgroundColor: theme.colors.primary },
              ]}
              onPressOut={() => {
                router.push(
                  `/teacher//book?category_id=${1}&teacher_id=${
                    teacher.teacher_id
                  }&user_id=${teacher.user_id}`
                );
              }}
            >
              <Text
                style={[styles.bookText, { color: theme.colors.buttonText }]}
              >
                {t("book_lesson")}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={[
          {
            userName: "tester",
            grade: 5,
            text: "It is just a test, does not affect anything",
          },
        ]}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.colors.card,
                borderRadius: 8,
                aspectRatio: 16 / 9,
              }}
            >
              <YouTubeVideo videoId={videoId} />
              {/* <YouTubeIframe
                width={"100%"}
                height={"100%"}
                videoId={videoId}
                play={true}
                onReady={() => console.log("Video is ready")}
              /> */}
            </View>
            <View
              style={[
                styles.white,
                styles.mainCard,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <Image
                source={avatarSource}
                style={styles.image}
                accessibilityLabel={`${teacher.name}'s profile picture`}
              />
              <View style={styles.teacherInfo}>
                <Text
                  style={[styles.teacherName, { color: theme.colors.text }]}
                >
                  {teacher.name} {teacher.surname}
                </Text>
                <View style={styles.skillsContainer}>
                  {teacher.skills.map((item) => (
                    <SkillBadge text={item.category_name} key={item.skill_id} />
                  ))}
                </View>
              </View>
            </View>
            <View
              style={[styles.white, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {t("about_me")}:
              </Text>
              <Line />
              <Text style={[styles.aboutText, { color: theme.colors.text }]}>
                {teacher.skills[0].about || t("no_description")}
              </Text>
            </View>
            <View
              style={[
                styles.white,
                styles.rate,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <StatsItem
                icon="star"
                value={teacher.skills[0].rate.toFixed(1)}
                label={t("rate")}
                iconColor="gold"
              />
              <StatsItem
                icon="graduation-cap"
                value={teacher.finished_lessons.toString()}
                label={t("lessons")}
                iconColor="#ccc"
              />
              <StatsItem
                icon="user"
                value={teacher.count_of_students.toString()}
                label={t("students")}
                iconColor="#ccc"
              />
            </View>
            <Pressable
              style={[
                styles.bookBtnMain,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => {
                router.push(
                  `/teacher/book?category_id=${1}&teacher_id=${
                    teacher.teacher_id
                  }&user_id=${teacher.user_id}`
                );
              }}
            >
              <Text
                style={[
                  styles.bookTextMain,
                  { color: theme.colors.buttonText },
                ]}
              >
                {t("book_lesson")}
              </Text>
            </Pressable>
            <Text style={[styles.reviewsTitle, { color: theme.colors.text }]}>
              {t("teacher_reviews")} (1)
            </Text>
          </View>
        }
        renderItem={({ item }) => <ReviewItem review={item} />}
        keyExtractor={(item) => item.userName}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const StatsItem = ({
  icon,
  value,
  label,
  iconColor,
}: {
  icon: FontAwesomeIconName;
  value: string;
  label: string;
  iconColor: string;
}) => {
  const { theme } = useTheme();
  return (
    <View style={styles.rates}>
      <Text style={{ color: theme.colors.text }}>
        <FontAwesome
          size={18}
          name={icon}
          style={{
            color: icon === "star" ? theme.colors.primary : theme.colors.text,
          }}
        />{" "}
        {value}
      </Text>
      <Text style={[styles.labelText, { color: theme.colors.text }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    gap: 12,
  },
  white: {
    borderRadius: 8,
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  mainCard: {
    flexDirection: "row",
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 10,
  },
  teacherInfo: {
    flex: 1,
    gap: 8,
    justifyContent: "space-between",
  },
  teacherName: {
    fontSize: 16,
    fontWeight: "600",
  },
  skillsContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  rate: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-around",
  },
  rates: {
    alignItems: "center",
  },
  goldText: {
    color: "#C9A977",
  },
  labelText: {
    color: "#777",
  },
  bookBtn: {
    padding: 8,
    backgroundColor: "#C9A977",
    borderRadius: 4,
    zIndex: 1000,
  },
  bookText: {
    color: "white",
  },
  sectionTitle: {
    fontSize: 18,
  },
  aboutText: {
    lineHeight: 20,
  },
  reviewsTitle: {
    paddingHorizontal: 16,
    fontSize: 18,
  },
  listContainer: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bookBtnMain: {
    padding: 16,
    backgroundColor: "#C9A977",
    borderRadius: 8,
    zIndex: 1000,
  },
  bookTextMain: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});

export default TeacherProfilePage;
