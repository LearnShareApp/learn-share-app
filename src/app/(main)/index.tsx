import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Redirect } from "expo-router";
import { useAuth } from "../../providers/auth-provider";
import { TEACHERS } from "../../../assets/teachers";
import TeacherListItem from "../../components/teacher-item";
import HeaderElement from "../../components/header-element";
import Line from "../../components/line";
import { useProfile } from "../../utilities/profile-hook";
import { useCategories } from "../../utilities/category-hook";
import SkillBadge from "../../components/skill";
import { useLanguage } from "../../providers/language-provider";
import { useTheme } from "../../providers/theme-provider";
import { apiService } from "../../utilities/api";
import { useEffect } from "react";
import { useState } from "react";
import { Lesson } from "../../utilities/api";

const Home = () => {
  const { token, signOut } = useAuth();
  const { t } = useLanguage();
  const { theme } = useTheme();

  if (!token) return <Redirect href={"/sign-in"} />;

  const { profile, loadingProfile, errorProfile } = useProfile();
  const { loadingCategories, errorCategories } = useCategories();

  const [nextLesson, setNextLesson] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const response = await apiService.getLessons();
        setNextLesson((response || []).filter((lesson) => lesson.status === "ongoing" || lesson.status === "waiting").sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()));
      } catch (err) {
        console.error("Error details:", err);
        setError("Failed to fetch teachers");
        setNextLesson([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  if (loadingProfile || loadingCategories) {
    return <>
      <HeaderElement text="Loading..." requireCalendar requireSettings />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    </>;
  }

  if (errorProfile || errorCategories) {
    return (
      <Pressable onPress={signOut}>
        <Text>Error: {errorProfile || errorCategories}</Text>
      </Pressable>
    );
  }

  return (
    <>
      <HeaderElement
        text={`${t("welcome")}, ${profile?.name}`}
        requireCalendar
        requireSettings
      />
      <ScrollView style={{ backgroundColor: theme.colors.background }}>
        <View style={styles.container}>
          <Link href="/search" asChild>
            <Pressable style={{ backgroundColor: theme.colors.card, width: "100%",
              height: 60,
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 4,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <Text style={[styles.searchText, { color: theme.colors.text }]}>{t("search_teacher")}</Text>
              <FontAwesome
                size={24}
                name="arrow-right"
                style={{ color: theme.colors.primary }}
              />
            </Pressable>
          </Link>
          <View style={[styles.info, { backgroundColor: theme.colors.card }]}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ color: theme.colors.text }}>{t("your_lessons")}</Text>
              <Link href="/lessons" asChild>
                <Text style={{ color: '#888' }}>{t("view_all")} {">"}</Text>
              </Link>
            </View>
            <Line />
            <View style={styles.infoStats}>
              <View style={styles.infoSection}>
                <Text style={[styles.infoNumber, { color: theme.colors.text }]}>0</Text>
                <Text style={{ color: '#888', width: 100, textAlign: "center" }}>
                  {t("successfully_completed")}
                </Text>
              </View>
              <View style={styles.infoSection}>
                <Text style={[styles.infoNumber, { color: theme.colors.text }]}>0</Text>
                <Text style={{ color: '#888', width: 100, textAlign: "center" }}>
                  {t("need_to_approve")}
                </Text>
              </View>
              <View style={styles.infoSection}>
                <Text style={[styles.infoNumber, { color: theme.colors.text }]}>0</Text>
                <Text style={{ color: '#888', width: 100, textAlign: "center" }}>
                  {t("waiting_to_join")}
                </Text>
              </View>
            </View>
            <View style={[styles.nextLessons, { backgroundColor: theme.colors.border }]}>
              <View style={{ width: "80%", gap: 8 }}>
                <Text style={{ color: theme.colors.text }}>{t("next_lesson")}</Text>
                <Line color={'#ccc'} />
                {nextLesson.length > 0 ? (<View style={{ flexDirection: "row", gap: 8 }}>
                  <Image
                    source={require("../../../assets/icon.png")}
                    style={styles.nextTeacherImage}
                  />
                  <View style={{ gap: 4 }}>
                    <Text style={{ color: theme.colors.text }}>{nextLesson[0].teacher_name} {nextLesson[0].teacher_surname}</Text>
                    <SkillBadge text={nextLesson[0].category_name} />
                  </View>
                </View>) : (<Text style={{ color: theme.colors.text, height: 48 }}>{t("no_lessons_today")}</Text>) }
                
              </View>

              <Link href="/rooms/" asChild>
                <Pressable style={{ flex: 1 }}>
                  <Text style={{ fontSize: 24, padding: 16, color: theme.colors.text }}>
                    {">"}
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
          <Text style={[styles.sectionText, { color: theme.colors.text }]}>
            {t("your_previous_teachers")}:
          </Text>
          <View style={[styles.listContainer, { flex: 1}]}>
            <View style={{ width: "100%", height: 120, backgroundColor: theme.colors.card, borderRadius: 8, justifyContent: "center", alignItems: "center", padding: 16 }}>
                <Text style={{ color: theme.colors.text }}>{t("you_will_see_your_previous_teachers_here")}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 8,
    height: "100%",
  },
  searchText: {
    fontSize: 14,
    width: 200,
  },
  info: {
    width: "100%",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  infoStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 4,
  },
  infoSection: {
    alignItems: "center",
  },
  infoNumber: {
    fontSize: 24,
  },
  infoLine: {
    width: 1,
    height: "100%",
  },
  sectionText: {
    paddingLeft: 8,
    fontSize: 18,
  },
  nextLessons: {
    padding: 16,
    width: "100%",
    borderRadius: 12,
    gap: 8,
    alignItems: "center",
    flexDirection: "row",
  },
  listContainer: {
    gap: 4,
    overflow: "visible",
  },
  nextTeacherImage: {
    width: 64,
    height: 64,
    borderRadius: 50,
  },
});
