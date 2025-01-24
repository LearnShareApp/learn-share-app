import { ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";
import LessonItem from "../components/lesson-item";
import { useEffect, useState } from "react";
import { apiService, TeacherLesson } from "../utilities/api";
import { Toast } from "react-native-toast-notifications";

const Requests = () => {
  const [lessons, setLessons] = useState<TeacherLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const response = await apiService.getTeacherLessons();
        setLessons(
          response.filter((lesson) => lesson.status === "verification") || []
        );
      } catch (err) {
        console.error("Error details:", err);
        setError("Failed to fetch teachers");
        Toast.show("Failed to load teachers", {
          type: "error",
          placement: "top",
          duration: 3000,
        });
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#C9A977" />;
  if (!lessons) return <Text>error</Text>;
  return (
    <FlatList
      data={lessons}
      renderItem={(lesson) => (
        <LessonItem forTeacher request lesson={lesson.item} />
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
