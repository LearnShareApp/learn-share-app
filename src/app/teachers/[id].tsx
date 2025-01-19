import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import SkillBadge from "../../components/skill";
import { FontAwesome } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import YoutubePlayer from "react-native-youtube-iframe";
import Line from "../../components/line";
import ReviewItem from "../../components/review-item";
import { REVIEWS } from "../../../assets/reviews";
import { apiService, TeacherProfile } from "../../utilities/api";
import { Toast } from "react-native-toast-notifications";

const TeacherProfilePage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [teacher, setTeacher] = useState<TeacherProfile>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        const response = await apiService.getTeacherById(id);
        setTeacher(response || []);
      } catch (err) {
        console.error("Error details:", err);
        setError("Failed to fetch teachers");
        Toast.show("Failed to load teachers", {
          type: "error",
          placement: "top",
          duration: 3000,
        });
        router.replace("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, []);

  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  const reviews = REVIEWS.filter((review) => review.teacherId === Number(id));

  if (!teacher) return null;

  return (
    <View>
      <Stack.Screen options={{ title: `${teacher.name} ${teacher.surname}` }} />
      <FlatList
        data={reviews}
        ListHeaderComponent={
          <View style={{ gap: 12 }}>
            <View style={styles.contentContainer}>
              <YoutubePlayer
                height={300}
                videoId="LXnMOP8Sn0Y"
                play={playing}
                onChangeState={onStateChange}
                onError={(e) => console.error("YouTube Error: ", e)}
              />
            </View>
            <View style={[styles.white, styles.mainCard]}>
              <Image
                source={require("../../../assets/icon.png")}
                style={styles.image}
              />
              <View style={styles.teacherInfo}>
                <Text>
                  {teacher.name} {teacher.surname}
                </Text>
                <View
                  style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}
                >
                  {teacher.skills.map((item) => (
                    <SkillBadge
                      text={item.category_id.toString()}
                      key={item.skill_id}
                    />
                  ))}
                </View>
              </View>
            </View>
            <View style={styles.white}>
              <Text style={{ fontSize: 18 }}>About me:</Text>
              <Line />
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quaerat repellat commodi harum voluptatem inventore nemo. Non
                pariatur, repellendus cum saepe, quo distinctio quis unde
                perferendis perspiciatis quaerat animi, cumque tenetur.
              </Text>
            </View>
            <View style={[styles.white, styles.rate]}>
              <View style={styles.rates}>
                <Text style={{ color: "#C9A977" }}>
                  <FontAwesome
                    size={18}
                    name="star"
                    style={{ color: "gold" }}
                  />{" "}
                  {teacher.skills[0].rate.toFixed(1)}
                </Text>
                <Text style={{ color: "#777" }}>rate</Text>
              </View>
              <View style={styles.rates}>
                <Text>
                  <FontAwesome
                    size={18}
                    name="graduation-cap"
                    style={{ color: "#ccc" }}
                  />{" "}
                  1345
                </Text>
                <Text style={{ color: "#777" }}>lessons</Text>
              </View>
              <View style={styles.rates}>
                <Text>
                  <FontAwesome
                    size={18}
                    name="user"
                    style={{ color: "#ccc" }}
                  />{" "}
                  234
                </Text>
                <Text style={{ color: "#777" }}>students</Text>
              </View>
            </View>
            <Text style={{ paddingHorizontal: 16, fontSize: 18 }}>
              Reviews ({reviews.length})
            </Text>
          </View>
        }
        renderItem={({ item }) => <ReviewItem review={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          gap: 8,
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
      />
    </View>
  );
};

export default TeacherProfilePage;

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: "100%",
    height: 180,
  },
  white: {
    backgroundColor: "white",
    borderRadius: 8,
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  mainCard: {
    flexDirection: "row",
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  teacherInfo: {
    flex: 1,
    gap: 8,
  },
  skillsList: {
    gap: 5,
    flexDirection: "row",
    width: "100%",
  },
  rate: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-around",
  },
  rates: {
    alignItems: "center",
  },
});
