import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import SkillBadge from "./skill";
import { FontAwesome } from "@expo/vector-icons";
import { TeacherSkill } from "../utilities/api";
import { useTeacher } from "../utilities/teacher-hook";
import { useTheme } from "../providers/theme-provider";
import { useLanguage } from "../providers/language-provider";

const TeacherSkillListItem = ({ skill }: { skill: TeacherSkill }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { teacher } = useTeacher();

  return (
    <Link href={`/teachers/${teacher?.teacher_id}`} asChild>
      <Pressable style={{ backgroundColor: theme.colors.card,gap: 12,
        width: "100%",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        minHeight: 100,
      }}>
        <View style={styles.teacherInfo}>
          <View style={styles.skillsList}>
            <SkillBadge text={skill.category_name} />
          </View>
          <View style={styles.grades}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: theme.colors.text,
              }}
            >
              {skill.rate ? skill.rate.toFixed(1) : t("no_reviews")}{" "}
              <FontAwesome size={24} name="star" style={{ color: "gold" }} />
            </Text>
          </View>
        </View>
        <View>
          <Text style={{ color: theme.colors.text }}>{skill.about}</Text>
        </View>
      </Pressable>
    </Link>
  );
};

export default TeacherSkillListItem;

const styles = StyleSheet.create({
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
