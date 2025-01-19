import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import SkillBadge from "./skill";
import { FontAwesome } from "@expo/vector-icons";
import { TeacherProfile } from "../utilities/api";

const TeacherListItem = ({ teacher }: { teacher: TeacherProfile }) => {
  if (!teacher) {
    return null;
  }

  const firstSkillRate = teacher.skills?.[0]?.rate ?? 0;

  return (
    <Link href={`/teachers/${teacher.teacher_id}`} asChild>
      <Pressable style={styles.item}>
        <Image
          source={require("../../assets/icon.png")}
          style={styles.avatar}
        />
        <View style={styles.teacherInfo}>
          <View style={styles.names}>
            <Text>{teacher.name}</Text>
            <Text>{teacher.surname}</Text>
          </View>
          <View style={styles.skillsList}>
            {teacher.skills?.length > 0 ? (
              teacher.skills.map((skill, index) => (
                <SkillBadge
                  text={skill.category_id.toString()}
                  key={`${skill.about}-${index}`}
                />
              ))
            ) : (
              <Text>No skills listed</Text>
            )}
          </View>
        </View>
        <View style={styles.grades}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {firstSkillRate.toFixed(1)}{" "}
            <FontAwesome size={24} name="star" style={{ color: "gold" }} />
          </Text>
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
    gap: 8,
  },
  names: {
    flexDirection: "row",
    color: "white",
    gap: 4,
  },
  skillsList: {
    gap: 5,
    flexWrap: "wrap",
    alignItems: "flex-start",
    flexDirection: "row",
  },
  grades: {
    alignItems: "center",
    marginLeft: "auto",
  },
});
