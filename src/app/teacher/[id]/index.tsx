import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import SkillBadge from "../../../components/skill";
import { FontAwesome } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import Line from "../../../components/line";
import ReviewItem from "../../../components/review-item";
import { REVIEWS } from "../../../../assets/reviews";
import { apiService, TeacherProfile } from "../../../utilities/api";

interface Review {
  id: number;
  teacherId: number;
}

const extractYoutubeId = (url: string): string => {
  const regExp =
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|watch\?v=|\&v=))([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : "";
};

type FontAwesomeIconName = "star" | "graduation-cap" | "user";

const TeacherProfilePage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        const response = await apiService.getTeacherById(id);
        if (!response) {
          throw new Error("Teacher not found");
        }
        setTeacher(response);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch teacher";
        setError(errorMessage);
        console.error("Error details:", err);
        router.replace("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id, router]);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  const reviews = REVIEWS.filter(
    (review: Review) => review.teacherId === Number(id)
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#C9A977" />
      </View>
    );
  }

  if (error || !teacher) {
    return (
      <View style={styles.centerContainer}>
        <Text>Error: {error || "Teacher not found"}</Text>
      </View>
    );
  }

  const videoId = extractYoutubeId(teacher.skills[0].video_card_link || "");

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `${teacher.name} ${teacher.surname}`,
          headerRight: () => (
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.bookBtn}
              onPress={() => {
                console.log("Navigating to:", `/teacher/${id}/book`);
                router.push({
                  pathname: `/teacher/${id}/book`,
                  params: { category_id: teacher.skills[0].category_id },
                });
              }}
            >
              <Text style={styles.bookText}>Резервишите час</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <FlatList
        data={reviews}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.contentContainer}>
              <YoutubePlayer
                height={300}
                videoId={videoId}
                play={playing}
                onChangeState={onStateChange}
                onError={(e) => {
                  console.error("YouTube Error: ", e);
                }}
              />
            </View>
            <View style={[styles.white, styles.mainCard]}>
              <Image
                source={require("../../../../assets/icon.png")}
                style={styles.image}
                accessibilityLabel={`${teacher.name}'s profile picture`}
              />
              <View style={styles.teacherInfo}>
                <Text style={styles.teacherName}>
                  {teacher.name} {teacher.surname}
                </Text>
                <View style={styles.skillsContainer}>
                  {teacher.skills.map((item) => (
                    <SkillBadge
                      text={item.category_name}
                      key={item.skill_id}
                    />
                  ))}
                </View>
              </View>
            </View>
            <View style={styles.white}>
              <Text style={styles.sectionTitle}>О мени:</Text>
              <Line />
              <Text style={styles.aboutText}>
                {teacher.skills[0].about || "No description available"}
              </Text>
            </View>
            <View style={[styles.white, styles.rate]}>
              <StatsItem
                icon="star"
                value={teacher.skills[0].rate.toFixed(1)}
                label="rate"
                iconColor="gold"
              />
              <StatsItem
                icon="graduation-cap"
                value="1345"
                label="lessons"
                iconColor="#ccc"
              />
              <StatsItem
                icon="user"
                value="234"
                label="students"
                iconColor="#ccc"
              />
            </View>
            <Pressable
              style={styles.bookBtnMain}
              onPress={() => {
                router.push(`/teacher/${id}/book?category_id=${1}`);
              }}
            >
              <Text style={styles.bookTextMain}>Резервишите час</Text>
            </Pressable>
            <Text style={styles.reviewsTitle}>
              Рецензије ({reviews.length})
            </Text>
          </View>
        }
        renderItem={({ item }) => <ReviewItem review={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const StatsItem = ({
  icon,
  value,
  label,
  iconColor,
}: {
  icon: FontAwesomeIconName;
  value: string;
  label: string;
  iconColor: string;
}) => (
  <View style={styles.rates}>
    <Text style={icon === "star" ? styles.goldText : undefined}>
      <FontAwesome size={18} name={icon} style={{ color: iconColor }} /> {value}
    </Text>
    <Text style={styles.labelText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    gap: 12,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
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
  teacherName: {
    fontSize: 16,
    fontWeight: "600",
  },
  skillsContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
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
  goldText: {
    color: "#C9A977",
  },
  labelText: {
    color: "#777",
  },
  bookBtn: {
    padding: 8,
    backgroundColor: "#C9A977",
    borderRadius: 4,
    zIndex: 1000,
  },
  bookText: {
    color: "white",
    fontWeight: "900",
  },
  sectionTitle: {
    fontSize: 18,
  },
  aboutText: {
    lineHeight: 20,
  },
  reviewsTitle: {
    paddingHorizontal: 16,
    fontSize: 18,
  },
  listContainer: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bookBtnMain: {
    padding: 16,
    backgroundColor: "#C9A977",
    borderRadius: 4,
    zIndex: 1000,
  },
  bookTextMain: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});

export default TeacherProfilePage;
