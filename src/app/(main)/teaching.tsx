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

const Teaching = () => {
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
        setError("Failed to fetch teachers");
        Toast.show("Failed to load teachers", {
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
  }, []);

  if (loadingTeacher) {
    return <HeaderElement text="Loading..." requireChanges requireSettings />;
  }

  if (teacher)
    return (
      <>
        <HeaderElement text="Teaching" requireChanges requireSettings />
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
                  Нови захтеви (
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
                <Text style={{ textAlign: "center" }}>Мој распоред</Text>
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
              <Text style={{ textAlign: "center" }}>
                Управљај мојим вештинама
              </Text>
            </Pressable>
          </Link>
          <Text style={{ fontSize: 20, paddingHorizontal: 16 }}>
            Следећи час:
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
                За сада немате часова
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
            <Text style={styles.cardText}>
              Да ли желите да предајете? Добродошли сте!
            </Text>
            <Text>Можете започети само у 3 лака корака:</Text>
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
            <Text style={styles.cardText}>1: Направите YouTube видео</Text>
            <Text>Где описујете и показујете своју вештину</Text>
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
            <Text style={styles.cardText}>
              2: Направите захтев да региструјете своју вештину
            </Text>
            <Text>Са везом на вашем YouTube видеу и описом</Text>
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
            <Text style={styles.cardText}>3: Сачекајте до одобрења</Text>
            <Text>Треба нам мало времена да проверимо ваш захтев</Text>
          </View>
        </View>

        <Link href={"/new-skill"} asChild>
          <TouchableOpacity activeOpacity={0.6} style={styles.btn}>
            <Text style={styles.text}>Заочнете да делите своjе вештине</Text>
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
