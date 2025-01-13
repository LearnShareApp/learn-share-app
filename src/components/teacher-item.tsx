import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
          <View style={styles.skillsList}>
            {teacher.categories.map((skill, index) => (
              <SkillBadge text={skill} key={index} />
            ))}
          </View>
        </View>
        <View style={styles.grades}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {teacher.grade.toFixed(1)}{" "}
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
