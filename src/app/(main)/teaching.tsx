import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { LESSONS } from "../../../assets/lessons";
import LessonItem from "../../components/lesson-item";
import HeaderElement from "../../components/header-element";
import { useTeacher } from "../../utilities/teacher-hook";

const Teaching = () => {
  const { teacher, loading, error } = useTeacher();

  if (loading) {
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
                <Text style={{ textAlign: "center" }}>New requests (0)</Text>
              </Pressable>
            </Link>

            <Link href={"/stats"} asChild>
              <Pressable style={styles.navBtn}>
                <FontAwesome
                  size={24}
                  name="pie-chart"
                  style={{ color: "#C9A977" }}
                />
                <Text style={{ textAlign: "center" }}>My skills</Text>
              </Pressable>
            </Link>
          </View>
          <Text style={{ fontSize: 20, paddingHorizontal: 16 }}>
            Your next lessons:
          </Text>
          <FlatList
            data={LESSONS}
            renderItem={(item) => <LessonItem lesson={item.item} />}
            contentContainerStyle={{ gap: 8 }}
          />
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
            <Text style={styles.cardText}>Wanna teach? Your are welcome!</Text>
            <Text>You can start just in 3 easy steps:</Text>
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
            <Text style={styles.cardText}>1: Make a YouTube video</Text>
            <Text>Where you describe and show your skill</Text>
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
              2: Make a requests to register your skill
            </Text>
            <Text>With link on your youtube video and text description</Text>
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
            <Text style={styles.cardText}>3: Wait until approvement</Text>
            <Text>We need some time to check you request</Text>
          </View>
        </View>

        <Link href={"/new-skill"} asChild>
          <Pressable style={styles.btn}>
            <Text style={styles.text}>Start sharing my skills</Text>
          </Pressable>
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
