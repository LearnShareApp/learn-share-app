import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import SkillBadge from "./skill";
import { FontAwesome } from "@expo/vector-icons";
import { TeacherProfile } from "../utilities/api";
import { useLanguage } from "../providers/language-provider";

const TeacherListItem = ({ teacher }: { teacher: TeacherProfile }) => {
  const { t } = useLanguage();
  if (!teacher) {
    return null;
  }

  const firstSkillRate = teacher.skills?.[0]?.rate ?? 0;

  return (
    <Link href={`/teacher/${teacher.teacher_id}`} asChild>
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
                  text={skill.category_name}
                  key={`${skill.about}-${index}`}
                />
              ))
            ) : (
              <Text>{t("no_skills_listed")}</Text>
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
            {firstSkillRate ? (
              <>
                {firstSkillRate.toFixed(1)}
                <FontAwesome size={24} name="star" style={{ color: "gold" }} />
              </>
            ) : (
              <>
                {"--"}
                <FontAwesome size={24} name="star" style={{ color: "gold" }} />
              </>
            )}{" "}
          </Text>
          <Text>3 {t("classes")}</Text>
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
    alignItems: "flex-end",
    marginLeft: "auto",
  },
});
