import {
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

const Home = () => {
  const { token, signOut } = useAuth();
  const { t } = useLanguage();

  if (!token) return <Redirect href={"/sign-in"} />;

  const { profile, loadingProfile, errorProfile } = useProfile();
  const { loadingCategories, errorCategories } = useCategories();

  if (loadingProfile || loadingCategories) {
    return <HeaderElement text="Loading..." requireCalendar requireSettings />;
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
      <ScrollView>
        <View style={styles.container}>
          <Link href="/search" asChild>
            <Pressable style={styles.search}>
              <Text style={styles.searchText}>{t("search_teacher")}</Text>
              <FontAwesome
                size={24}
                name="arrow-right"
                style={{ color: "#C9A977" }}
              />
            </Pressable>
          </Link>
          <View style={styles.info}>
            <Text>{t("your_lessons")}</Text>
            <Line />
            <View style={styles.infoStats}>
              <View style={styles.infoSection}>
                <Text style={styles.infoNumber}>24</Text>
                <Text
                  style={{ color: "#888", width: 100, textAlign: "center" }}
                >
                  {t("successfully_completed")}
                </Text>
              </View>
              <View style={styles.infoSection}>
                <Text style={styles.infoNumber}>3</Text>
                <Text
                  style={{ color: "#888", width: 100, textAlign: "center" }}
                >
                  {t("need_to_approve")}
                </Text>
              </View>
              <View style={styles.infoSection}>
                <Text style={styles.infoNumber}>2</Text>
                <Text
                  style={{ color: "#888", width: 100, textAlign: "center" }}
                >
                  {t("waiting_to_join")}
                </Text>
              </View>
            </View>
            <View style={styles.nextLessons}>
              <View style={{ width: "80%", gap: 8 }}>
                <Text>{t("next_lesson")}</Text>
                <Line />
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Image
                    source={require("../../../assets/icon.png")}
                    style={styles.nextTeacherImage}
                  />
                  <View style={{ gap: 4 }}>
                    <Text>Name Surname</Text>
                    <SkillBadge text={"nonono"} />
                  </View>
                </View>
              </View>

              <Link href="/rooms/" asChild>
                <Pressable style={{ flex: 1 }}>
                  <Text style={{ fontSize: 24, padding: 16, color: "#bbb" }}>
                    {">"}
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
          <Text style={styles.sectionText}>{t("your_previous_teachers")}:</Text>
          <View style={styles.listContainer}>
            {TEACHERS.map((teacher) => (
              <TeacherListItem teacher={teacher} key={teacher.id} />
            ))}
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
  },
  search: {
    width: "100%",
    height: 60,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchText: {
    fontSize: 14,
    width: 200,
  },
  info: {
    width: "100%",
    backgroundColor: "white",
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
    backgroundColor: "#ddd",
  },
  sectionText: {
    paddingLeft: 8,
    fontSize: 18,
  },
  nextLessons: {
    padding: 16,
    width: "100%",
    backgroundColor: "#eee",
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
