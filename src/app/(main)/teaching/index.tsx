import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Line from "../../../components/line";
import { LESSONS } from "../../../../assets/lessons";
import LessonItem from "../../../components/lesson-item";
import HeaderElement from "../../../components/header-element";

const Teaching = () => {
  if (true)
    return (
      <>
        <HeaderElement
          text="Teaching"
          requireCalendar={false}
          requireChanges
          requireSettings
        />
        r
        <View
          style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 8, gap: 8 }}
        >
          <View style={styles.topNav}>
            <Link href={"/"} asChild>
              <Pressable style={styles.navBtn}>
                <FontAwesome
                  size={24}
                  name="bell"
                  style={{ color: "#C9A977" }}
                />
                <Text style={{ textAlign: "center" }}>New requests (0)</Text>
              </Pressable>
            </Link>

            <Link href={"/"} asChild>
              <Pressable style={styles.navBtn}>
                <FontAwesome
                  size={24}
                  name="pie-chart"
                  style={{ color: "#C9A977" }}
                />
                <Text style={{ textAlign: "center" }}>View stats</Text>
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
    <View style={styles.container}>
      <Text>You are not a teacher, but you can become one</Text>
      <Link href={"/new-skill"} asChild>
        <Pressable style={styles.btn}>
          <Text style={styles.text}>Start sharing my skills</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default Teaching;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btn: {
    padding: 16,
    backgroundColor: "#C9A977",
    borderRadius: 8,
  },
  text: {
    textAlign: "center",
    verticalAlign: "middle",
    color: "white",
    fontSize: 20,
  },
  white: {
    backgroundColor: "white",
    minHeight: 32,
    borderRadius: 8,
    padding: 8,
    gap: 8,
    width: "100%",
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
});
