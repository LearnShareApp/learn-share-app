import { FlatList, StyleSheet, Text } from "react-native";
import LessonItem from "../components/lesson-item";

const Requests = () => {
  return (
    <FlatList
      data={[3, 3, 3, 3, 3, 3]}
      renderItem={() => (
        <LessonItem
          forTeacher
          request
          lesson={{
            id: 2,
            userId: 21,
            teacherId: 1,
            category: "programming",
            price: 39.9,
            date: "31dec",
            status: "ongoing",
          }}
        />
      )}
      contentContainerStyle={styles.skillsList}
    />
  );
};

export default Requests;

const styles = StyleSheet.create({
  skillsList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
});
