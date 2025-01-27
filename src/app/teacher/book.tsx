import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toast } from "react-native-toast-notifications";
import DropDownPicker from "react-native-dropdown-picker";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  apiService,
  DateTime,
  Skill,
  TeacherProfile,
} from "../../utilities/api";
import axios from "axios";
import { useLanguage } from "../../providers/language-provider";
import { useTheme } from "../../providers/theme-provider";

const authSchema = zod.object({
  category_id: zod.number(),
  schedule_time_id: zod.number(),
});

const formatDateTime = (date: Date): string => {
  return date.toLocaleString("srb-SRB", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function BookLesson() {
  const { category_id, teacher_id, user_id } = useLocalSearchParams<{
    category_id?: string;
    teacher_id: string;
    user_id: string;
  }>();
  const router = useRouter();
  const { t } = useLanguage();
  const { theme } = useTheme();

  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [availableTimes, setAvailableTimes] = useState<DateTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [skillItems, setSkillItems] = useState<Skill[]>([]);
  const [timeItems, setTimeItems] = useState<
    { label: string; value: number }[]
  >([]);
  const [openSkill, setOpenSkill] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(
    category_id || null
  );
  const [selectedTime, setSelectedTime] = useState<number | null>(null);

  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      category_id: category_id ? Number(category_id) : -1,
      schedule_time_id: -1,
    },
  });

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        const teacherResponse = await apiService.getTeacherById(user_id);
        if (!teacherResponse) {
          throw new Error("Teacher not found");
        }
        setTeacher(teacherResponse);

        const timesResponse = await apiService.getTimeById(user_id);
        const availableTimes = timesResponse.filter(
          (time) => time.is_available
        );
        setAvailableTimes(availableTimes);
      } catch (err) {
        console.error("Error details:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch data";
        setError(errorMessage);
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          router.replace("/404");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user_id) {
      fetchTeacherData();
    }
  }, [user_id, router]);

  useEffect(() => {
    if (teacher?.skills) {
      const items = teacher.skills.map((skill) => ({
        label: skill.category_name,
        value: skill.category_id.toString(),
      }));
      setSkillItems(items);
    }
  }, [teacher]);

  useEffect(() => {
    if (availableTimes.length > 0) {
      const items = availableTimes.map((time) => ({
        label: formatDateTime(time.datetime),
        value: time.schedule_time_id,
      }));
      setTimeItems(items);
    }
  }, [availableTimes]);

  const SendRequest = async (data: zod.infer<typeof authSchema>) => {
    try {
      const postData = {
        teacher_id: Number(teacher_id),
        category_id: data.category_id,
        schedule_time_id: data.schedule_time_id,
      };

      console.log("Sending request with data:", postData);
      await apiService.lessonRequest(postData);
      Toast.show("Request sent successfully", {
        type: "success",
        placement: "top",
        duration: 1500,
      });
      router.back();
    } catch (error) {
      console.error("Request error:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "An unknown error occurred";
        Toast.show(errorMessage, {
          type: "warning",
          placement: "top",
          duration: 3000,
        });
      } else {
        Toast.show("An unexpected error occurred", {
          type: "warning",
          placement: "top",
          duration: 3000,
        });
      }
    }
  };

  if (loading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.text }}>{t("loading")}</Text>
      </View>
    );
  }

  if (error || !teacher) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text style={{ color: theme.colors.text }}>
          {t("teacher_not_found")}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Controller
        control={control}
        name="category_id"
        render={({ field: { onChange }, fieldState: { error } }) => (
          <>
            <DropDownPicker
              open={openSkill}
              value={selectedSkill}
              items={skillItems}
              setOpen={setOpenSkill}
              dropDownContainerStyle={{
                borderColor: "transparent",
                backgroundColor: theme.colors.card,
              }}
              setValue={(callback) => {
                const newValue =
                  typeof callback === "function"
                    ? callback(selectedSkill)
                    : callback;
                setSelectedSkill(newValue);
                if (newValue) {
                  onChange(Number(newValue));
                }
              }}
              setItems={setSkillItems}
              placeholder={t("select_skill")}
              style={[
                styles.dropDown,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: "transparent",
                },
              ]}
              textStyle={{ color: theme.colors.text }}
              zIndex={2000}
            />
            {error && (
              <Text style={[styles.error, { color: theme.colors.error }]}>
                {error.message}
              </Text>
            )}
          </>
        )}
      />

      <Controller
        control={control}
        name="schedule_time_id"
        render={({ field: { onChange }, fieldState: { error } }) => (
          <>
            <DropDownPicker
              open={openTime}
              value={selectedTime}
              items={timeItems}
              setOpen={setOpenTime}
              dropDownContainerStyle={{
                borderColor: "transparent",
                backgroundColor: theme.colors.card,
              }}
              setValue={(callback) => {
                const newValue =
                  typeof callback === "function"
                    ? callback(selectedTime)
                    : callback;
                setSelectedTime(newValue);
                if (newValue) {
                  onChange(Number(newValue));
                }
              }}
              setItems={setTimeItems}
              placeholder={t("select_time")}
              style={[
                styles.dropDown,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: "transparent",
                },
              ]}
              textStyle={{ color: theme.colors.text }}
              zIndex={1000}
            />
            {error && (
              <Text style={[styles.error, { color: theme.colors.error }]}>
                {error.message}
              </Text>
            )}
          </>
        )}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleSubmit(SendRequest)}
        disabled={formState.isSubmitting}
      >
        <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>
          {t("book_lesson")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    alignItems: "center",
  },
  dropDown: {
    width: "100%",
    maxWidth: 600,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
    alignSelf: "center",
  },
  error: {
    fontSize: 12,
    marginBottom: 16,
    textAlign: "left",
    width: "90%",
  },
  button: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
    maxWidth: 600,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
