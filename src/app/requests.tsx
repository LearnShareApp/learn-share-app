import { ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";
import LessonItem from "../components/lesson-item";
import { useEffect, useState } from "react";
import { apiService, TeacherLesson } from "../utilities/api";
import EventEmitter from "../utilities/event-emitter";
import { useTheme } from "../providers/theme-provider";
import { useLanguage } from "../providers/language-provider";

const Requests = () => {
  const {theme} = useTheme();
  const { t } = useLanguage();
  
  const [lessons, setLessons] = useState<TeacherLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTeacherLessons();
      const sortedLessons = response
        .filter((lesson) => lesson.status === "verification")
        .sort((a, b) => {
          const dateA = new Date(a.datetime);
          const dateB = new Date(b.datetime);
          return dateA.getTime() - dateB.getTime();
        });
      setLessons(sortedLessons || []);
    } catch (err) {
      console.error("Error details:", err);
      setError("Failed to fetch teachers");
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  useEffect(() => {
    const subscription = EventEmitter.addListener('lessonRemoved', (lessonId: number) => {
      setLessons(prevLessons => prevLessons.filter(lesson => lesson.lesson_id !== lessonId));
    });

    return () => subscription.remove();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#C9A977" />;
  if (!lessons) return <Text>error</Text>;
  return (
    lessons.length === 0 ? (
      <Text style={{ color: theme.colors.text, padding: 16, alignSelf: "center" }}>{t("no_requests")}</Text>
    ) : (
      <FlatList
        data={lessons}
        renderItem={(lesson) => (
          <LessonItem forTeacher request lesson={lesson.item} />
        )}
        contentContainerStyle={styles.skillsList}
      />
    )
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
function useTranslation(): { t: any; } {
  throw new Error("Function not implemented.");
}

