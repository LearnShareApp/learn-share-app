import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import SkillBadge from "./skill";
import { FontAwesome } from "@expo/vector-icons";
import { TeacherSkill } from "../utilities/api";
import { useTeacher } from "../utilities/teacher-hook";

const TeacherSkillListItem = ({ skill }: { skill: TeacherSkill }) => {
  const { teacher } = useTeacher();

  return (
    <Link href={`/teachers/${teacher?.teacher_id}`} asChild>
      <Pressable style={styles.item}>
        <View style={styles.teacherInfo}>
          <View style={styles.skillsList}>
            <SkillBadge text={skill.category_name} />
          </View>
          <View style={styles.grades}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {skill.rate ? skill.rate.toFixed(1) : "Нема рецензија"}{" "}
              <FontAwesome size={24} name="star" style={{ color: "gold" }} />
            </Text>
          </View>
        </View>
        <View>
          <Text>{skill.about}</Text>
        </View>
      </Pressable>
    </Link>
  );
};

export default TeacherSkillListItem;

const styles = StyleSheet.create({
  item: {
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
    flexDirection: "row",
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
