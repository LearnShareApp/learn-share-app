import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Teacher } from "../../assets/types/teacher";
import { Link } from "expo-router";

const TeacherListItem = ({ teacher }: { teacher: Teacher }) => {
  return (
    <Link href={`/teachers/${teacher.id}`} asChild>
      <Pressable style={styles.item}>
        <View>
          <Image source={teacher.avatarImage} style={styles.avatar} />
          <View style={styles.names}>
            <Text style={styles.name}>{teacher.Name}</Text>
            <Text style={styles.surname}>{teacher.Surname}</Text>
          </View>
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
    backgroundColor: "white",
    width: "100%",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minHeight: 100,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  names: {
    flexDirection: "row",
    color: "white",
    gap: 4,
  },
  name: {},
  surname: {},
});
