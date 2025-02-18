import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import SkillBadge from "../../components/skill";
import YouTubeVideo from "../../components/youtube-video";
import { FontAwesome } from "@expo/vector-icons";
import Line from "../../components/line";
import ReviewItem from "../../components/review-item";
import { apiService, Review, TeacherProfile } from "../../utilities/api";
import { useLanguage } from "../../providers/language-provider";
import { useTheme } from "../../providers/theme-provider";
import { useAvatar } from "../../utilities/avatar-hook";
import { useRefresh } from "../../providers/refresh-provider";
import { StatusBar } from "expo-status-bar";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DropDownPicker from "react-native-dropdown-picker";
import { Toast } from "react-native-toast-notifications";
import axios from "axios";

type FontAwesomeIconName = "star" | "graduation-cap" | "user";

const TeacherProfilePage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { category } = useLocalSearchParams<{ category?: string }>();
  const { review } = useLocalSearchParams<{ review?: string }>();
  const router = useRouter();

  const { t } = useLanguage();
  const { theme, isDark } = useTheme();

  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(
    review === "1" ? true : false
  );

  const { refreshing, setRefreshing } = useRefresh();

  // Состояния для управления открытием выпадающих списков
  const [openCategory, setOpenCategory] = useState(false);
  const [openRate, setOpenRate] = useState(false);

  // Задаем схему валидации для формы отзыва
  const reviewSchema = z.object({
    category_id: z.number({ required_error: "Выберите категорию" }),
    comment: z.string().min(1, "Комментарий не может быть пустым"),
    rate: z
      .number({ required_error: "Укажите рейтинг" })
      .min(1, "Рейтинг должен быть минимум 1")
      .max(5, "Рейтинг не может превышать 5"),
    teacher_id: z.number(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      category_id: 0,
      comment: "",
      rate: 3,
      teacher_id: 0,
    },
  });

  // Получаем выбранный навык (либо по параметру, либо первый из списка)
  const selectedSkill = category
    ? teacher?.skills.find((skill) => skill.category_id.toString() === category)
    : teacher?.skills[0];

  // Сброс значений формы при загрузке учителя и выбранного навыка
  useEffect(() => {
    if (teacher && selectedSkill) {
      reset({
        category_id: selectedSkill.category_id,
        comment: "",
        rate: 3,
        teacher_id: teacher.teacher_id,
      });
    }
  }, [teacher, selectedSkill, reset]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTeacher();
    setRefreshing(false);
  };

  const { avatarSource } = useAvatar(teacher?.avatar ?? null);

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

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await apiService.getTeacherReviews(id);
      if (!response) {
        throw new Error("Teacher not found");
      }
      setReviews(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch teacher";
      setReviewsError(errorMessage);
      console.error("Error details:", err);
      router.replace("/404");
    } finally {
      setReviewsLoading(false);
    }
  };

  const onSubmitReview = async (data: z.infer<typeof reviewSchema>) => {
    try {
      const response = await apiService.addReview(data);
      Toast.show(t("request_success"), {
        type: "success",
        placement: "top",
        duration: 1500,
      });
      console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "An unknown error occurred";
        Toast.show(t("unknown_error"), {
          type: "warning",
          placement: "top",
          duration: 3000,
        });
        console.log(errorMessage);
      } else {
        console.error("Unexpected error:", error);
        Toast.show(t("unexpected_error"), {
          type: "error",
          placement: "top",
          duration: 3000,
        });
      }
    }

    setModalVisible(false);
  };

  useEffect(() => {
    fetchTeacher();
    fetchReviews();
  }, [id, review]);

  const closeModal = () => {
    setModalVisible(false);
  };

  // Уже имеется функция onSubmitReview выше. Добавляем ниже новые состояния:

  const [complaintModalVisible, setComplaintModalVisible] = useState(false);
  const [complaintText, setComplaintText] = useState("");

  // Функция отправки жалобы
  const onSubmitComplaint = () => {
    Toast.show(t("complaint_sent") || "Жалоба отправлена", {
      type: "success",
      placement: "top",
      duration: 1500,
    });
    setComplaintText("");
    setComplaintModalVisible(false);
  };

  if (loading) {
    return (
      <View
        style={[
          styles.centerContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !teacher || teacher.skills.length === 0) {
    return (
      <View
        style={[
          styles.centerContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={{ color: theme.colors.text }}>
          Error: {error || "Teacher not found"}
        </Text>
      </View>
    );
  }

  if (!selectedSkill) {
    return (
      <View
        style={[
          styles.centerContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={{ color: theme.colors.text }}>Skill not found</Text>
      </View>
    );
  }
  const videoId =
    selectedSkill.video_card_link?.length > 14
      ? selectedSkill?.video_card_link.split("v=")[1]?.split("&")[0]
      : selectedSkill?.video_card_link ?? "";

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Stack.Screen
        options={{
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
          title: `${teacher.name} ${teacher.surname}`,
          headerRight: () => (
            <TouchableOpacity
              activeOpacity={0.6}
              style={[
                styles.bookBtn,
                { backgroundColor: theme.colors.primary },
              ]}
              onPressOut={() => {
                router.push(
                  `/teacher/book?category_id=${selectedSkill.category_id}&teacher_id=${teacher.teacher_id}&user_id=${teacher.user_id}`
                );
              }}
            >
              <Text
                style={[styles.bookText, { color: theme.colors.buttonText }]}
              >
                {t("book_lesson")}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={reviews}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.colors.card,
                borderRadius: 8,
                aspectRatio: 16 / 9,
              }}
            >
              <YouTubeVideo videoId={videoId} />
            </View>
            <View
              style={[
                styles.white,
                styles.mainCard,
                { backgroundColor: theme.colors.card, position: "relative" },
              ]}
            >
              <Image
                source={avatarSource}
                style={styles.image}
                accessibilityLabel={`${teacher.name}'s profile picture`}
              />
              <View style={styles.teacherInfo}>
                <Text
                  style={[styles.teacherName, { color: theme.colors.text }]}
                >
                  {teacher.name} {teacher.surname}
                </Text>
                <View style={styles.skillsContainer}>
                  {teacher.skills.map((item) => (
                    <Link
                      href={`/teacher/${teacher.teacher_id}?category=${item.category_id}`}
                      key={item.skill_id}
                    >
                      <SkillBadge
                        text={item.category_name}
                        {...(item.category_name !==
                          selectedSkill.category_name && { inactive: true })}
                      />
                    </Link>
                  ))}
                </View>
              </View>
              <TouchableOpacity
                style={styles.complaintButton}
                onPress={() => setComplaintModalVisible(true)}
              >
                <FontAwesome
                  name="exclamation-circle"
                  size={20}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
            <View
              style={[styles.white, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {t("about_me")}:
              </Text>
              <Line />
              <Text style={[styles.aboutText, { color: theme.colors.text }]}>
                {selectedSkill.about || t("no_description")}
              </Text>
            </View>
            <View
              style={[
                styles.white,
                styles.rate,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <StatsItem
                icon="star"
                value={
                  selectedSkill.rate !== 0
                    ? selectedSkill.rate.toFixed(1)
                    : "--"
                }
                label={t("rate")}
                iconColor="gold"
              />
              <StatsItem
                icon="graduation-cap"
                value={(teacher.finished_lessons ?? 0).toString()}
                label={t("lessons")}
                iconColor="#ccc"
              />
              <StatsItem
                icon="user"
                value={(teacher.count_of_students ?? 0).toString()}
                label={t("students")}
                iconColor="#ccc"
              />
            </View>
            <Pressable
              style={[
                styles.bookBtnMain,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => {
                router.push(
                  `/teacher/book?category_id=${selectedSkill.category_id}&teacher_id=${teacher.teacher_id}&user_id=${teacher.user_id}`
                );
              }}
            >
              <Text
                style={[
                  styles.bookTextMain,
                  { color: theme.colors.buttonText },
                ]}
              >
                {t("book_lesson")}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setModalVisible(true)}
              style={{
                padding: 16,
                borderWidth: 1,
                borderColor: theme.colors.primary,
                borderRadius: 8,
                zIndex: 1000,
              }}
            >
              <Text
                style={{
                  color: theme.colors.primary,
                  textAlign: "center",
                }}
              >
                {t("leave_review")}
              </Text>
            </Pressable>
            <Text style={[styles.reviewsTitle, { color: theme.colors.text }]}>
              {t("teacher_reviews")} ({teacher.common_reviews_count})
            </Text>
          </View>
        }
        renderItem={({ item }) => <ReviewItem review={item} />}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={{ color: theme.colors.text }}>{t("no_reviews")}</Text>
          </View>
        }
      />
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: theme.colors.card },
                ]}
              >
                <View style={styles.modalHeader}>
                  <Text
                    style={[styles.modalTitle, { color: theme.colors.text }]}
                  >
                    {t("leave_review")}
                  </Text>
                  <TouchableOpacity onPress={closeModal}>
                    <FontAwesome
                      name="times"
                      size={20}
                      color={theme.colors.text}
                    />
                  </TouchableOpacity>
                </View>

                {/* Поле выбора категории */}
                <Text style={{ color: theme.colors.text }}>
                  {t("category")}
                </Text>
                <Controller
                  control={control}
                  name="category_id"
                  render={({ field: { onChange, value } }) => (
                    <View style={{ zIndex: 3000 }}>
                      <DropDownPicker
                        open={openCategory}
                        value={value}
                        items={
                          teacher
                            ? teacher.skills.map((skill) => ({
                                label: skill.category_name,
                                value: skill.category_id,
                              }))
                            : []
                        }
                        setOpen={setOpenCategory}
                        setValue={(callback) => {
                          const newValue = callback(value);
                          onChange(newValue);
                        }}
                        containerStyle={{ marginVertical: 8 }}
                        style={{ backgroundColor: theme.colors.background }}
                        textStyle={{ color: theme.colors.text }}
                      />
                    </View>
                  )}
                />
                {errors.category_id && (
                  <Text style={{ color: "red" }}>
                    {errors.category_id.message}
                  </Text>
                )}

                {/* Поле выбора рейтинга */}
                <Text style={{ color: theme.colors.text }}>{t("rate")}</Text>
                <Controller
                  control={control}
                  name="rate"
                  render={({ field: { onChange, value } }) => (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginVertical: 8,
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((num) => {
                        const isSelected = value === num;
                        return (
                          <TouchableOpacity
                            key={num}
                            onPress={() => onChange(num)}
                            style={[
                              {
                                borderWidth: 1,
                                borderRadius: 8,
                                borderColor: theme.colors.primary,
                                marginHorizontal: 4,
                                width: 40,
                                height: 40,
                                alignItems: "center",
                                justifyContent: "center",
                              },
                              isSelected && {
                                backgroundColor: theme.colors.primary,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                { fontSize: 16, color: theme.colors.text },
                                isSelected && { color: "white" },
                              ]}
                            >
                              {num}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                />
                {errors.rate && (
                  <Text style={{ color: "red" }}>{errors.rate.message}</Text>
                )}

                {/* Поле ввода комментария */}
                <Text style={{ color: theme.colors.text }}>{t("comment")}</Text>
                <Controller
                  control={control}
                  name="comment"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[
                        styles.input,
                        {
                          color: theme.colors.text,
                          borderColor: theme.colors.primary,
                        },
                      ]}
                      onChangeText={onChange}
                      value={value}
                      placeholder={t("comment_placeholder")}
                      placeholderTextColor={theme.colors.text}
                      multiline
                    />
                  )}
                />
                {errors.comment && (
                  <Text style={{ color: "red" }}>{errors.comment.message}</Text>
                )}

                {/* Кнопка отправки формы */}
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={handleSubmit(onSubmitReview)}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    {t("submit_review")}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        visible={complaintModalVisible}
        transparent={true}
        animationType="fade"
      >
        <TouchableWithoutFeedback
          onPress={() => setComplaintModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: theme.colors.card },
                ]}
              >
                <View style={styles.modalHeader}>
                  <Text
                    style={[styles.modalTitle, { color: theme.colors.text }]}
                  >
                    {t("complaint")}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setComplaintModalVisible(false)}
                  >
                    <FontAwesome
                      name="times"
                      size={20}
                      color={theme.colors.text}
                    />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: theme.colors.text,
                      borderColor: theme.colors.primary,
                      height: 100,
                      textAlignVertical: "top",
                    },
                  ]}
                  onChangeText={(text) => setComplaintText(text)}
                  value={complaintText}
                  placeholder={t("complaint_placeholder")}
                  placeholderTextColor={theme.colors.text}
                  multiline
                />
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={onSubmitComplaint}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    {t("submit_complaint")}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
}) => {
  const { theme } = useTheme();
  return (
    <View style={styles.rates}>
      <Text style={{ color: theme.colors.text }}>
        <FontAwesome
          size={18}
          name={icon}
          style={{
            color: icon === "star" ? theme.colors.primary : theme.colors.text,
          }}
        />{" "}
        {value}
      </Text>
      <Text style={[styles.labelText, { color: theme.colors.text }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullscreen: {
    width: "100%",
    height: "100%",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    gap: 12,
  },
  white: {
    borderRadius: 8,
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  mainCard: {
    flexDirection: "row",
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 10,
  },
  teacherInfo: {
    flex: 1,
    gap: 8,
    justifyContent: "space-between",
  },
  teacherName: {
    fontSize: 16,
    fontWeight: "600",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
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
    borderRadius: 8,
    zIndex: 1000,
  },
  bookTextMain: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "100%",
    padding: 20,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginVertical: 8,
  },
  submitButton: {
    borderRadius: 4,
    padding: 12,
    marginTop: 12,
  },
  complaintButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 8,
  },
});

export default TeacherProfilePage;
