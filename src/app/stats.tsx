import { FlatList, Pressable, StyleSheet, Text } from "react-native";
import { useCategories } from "../utilities/category-hook";
import { useTeacher } from "../utilities/teacher-hook";
import TeacherSkillListItem from "../components/teacher-skill-list-item";
import { Link } from "expo-router";
import { useTheme } from "../providers/theme-provider";
import { useLanguage } from "../providers/language-provider";

const Stats = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { categories } = useCategories();
  const { teacher } = useTeacher();

  if (!categories || !teacher) return <Text>error</Text>;

  return (
    <FlatList
      data={teacher.skills}
      renderItem={(skill) => <TeacherSkillListItem skill={skill.item} />}
      contentContainerStyle={styles.skillsList}
      ListFooterComponent={
        <Link href={"/new-skill"} asChild>
          <Pressable style={styles.btn}>
            <Text style={styles.text}>{t("add_skill")}</Text>
          </Pressable>
        </Link>
      }
      ListFooterComponentStyle={styles.footer}
    />
  );
};

export default Stats;

const styles = StyleSheet.create({
  skillsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    overflow: "scroll",
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
    fontSize: 18,
  },
  footer: {},
});
