import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { Teacher } from "../../assets/types/teacher";
import { Link } from "expo-router";
import SkillBadge from "./skill";
import { FontAwesome } from "@expo/vector-icons";

const TeacherListItem = ({ teacher }: { teacher: Teacher }) => {
  return (
    <Link href={`/teachers/${teacher.id}`} asChild>
      <Pressable style={styles.item}>
        <Image source={teacher.avatarImage} style={styles.avatar} />
        <View style={styles.teacherInfo}>
          <View style={styles.names}>
            <Text>{teacher.Name}</Text>
            <Text>{teacher.Surname}</Text>
          </View>
          <FlatList
            data={teacher.skills}
            style={styles.skillsList}
            renderItem={(item) => <SkillBadge text={item.item} />}
          />
          <Text>3 lessons</Text>
        </View>
        <View style={styles.grades}>
          <FontAwesome size={24} name="star" style={{ color: "#C9A977" }} />
          <Text>5.0</Text>
          <Text>3 lessons</Text>
        </View>
      </Pressable>
    </Link>
  );
};

export default TeacherListItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "white",
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minHeight: 100,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 50,
  },
  teacherInfo: {
    flex: 1,
  },
  names: {
    flexDirection: "row",
    color: "white",
    gap: 4,
  },
  skillsList: {
    gap: 5,
    flexDirection: "row",
  },
  grades: {
    alignItems: "center",
  },
});
