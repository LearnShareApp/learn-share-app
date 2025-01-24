import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import LessonItem from "../../components/lesson-item";
import { apiService, Lesson } from "../../utilities/api";
import { Toast } from "react-native-toast-notifications";
import { Link } from "expo-router";

const Rooms = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const response = await apiService.getLessons();
        setLessons(response || []);
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

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#C9A977"
        style={{ marginTop: 16 }}
      />
    );

  return (
    <View style={styles.container}>
      {lessons.length ? (
        <FlatList
          data={lessons}
          renderItem={(item) => <LessonItem lesson={item.item} />}
          contentContainerStyle={{ gap: 8 }}
        />
      ) : (
        <View style={styles.center}>
          <Text style={{ textAlign: "center" }}>За сада немате часова</Text>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.btn}>
              <Text style={{ color: "white", textAlign: "center" }}>
                Иди назад
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
    </View>
  );
};

export default Rooms;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  btn: {
    width: "60%",
    backgroundColor: "#C9A977",
    borderRadius: 4,
    padding: 16,
  },
});
