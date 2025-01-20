import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Button,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toast } from "react-native-toast-notifications";
import DropDownPicker from "react-native-dropdown-picker";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useProfile } from "../../../utilities/profile-hook";
import { apiService, Skill, TeacherProfile } from "../../../utilities/api";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";

const authSchema = zod.object({
  teacher_id: zod.number(),
  user_id: zod.number(),
  category_id: zod.number(),
  date: zod.date(),
});

export default function BookLesson() {
  const { id, category_id } = useLocalSearchParams<{
    id: string;
    category_id?: string;
  }>();
  const router = useRouter();

  const { profile } = useProfile();

  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

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

  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      teacher_id: Number(id), // Исправление 1
      user_id: -1,
      category_id: -1,
      date: new Date(),
    },
  });

  const SendRequest = async (data: zod.infer<typeof authSchema>) => {
    try {
      const postData = {
        teacher_id: data.teacher_id,
        user_id: data.user_id,
        category_id: data.category_id,
        date: data.date,
      };
      const response = await apiService.lessonRequest(postData);
      Toast.show("Request sended in successfully", {
        type: "success",
        placement: "top",
        duration: 1500,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "An unknown error occurred";
        Toast.show(errorMessage, {
          type: "warning",
          placement: "top",
          duration: 3000,
        });
        console.log(errorMessage);
      } else {
        console.error("Unexpected error:", error);
        Toast.show("An unexpected error occurred", {
          type: "warning",
          placement: "top",
          duration: 3000,
        });
      }
    }
  };

  const [items, setItems] = useState<Skill[]>([]);
  const [showPickerTime, setShowPickerTime] = useState(false);
  const [showPickerDate, setShowPickerDate] = useState(false);

  const [selectedSkill, setSelectedSkill] = useState<string | null>(
    category_id || null
  );

  useEffect(() => {
    setItems(
      teacher?.skills?.map((skill) => ({
        label: skill.category_name,
        value: skill.skill_id.toString(),
      })) || []
    );
  }, [teacher]);

  useEffect(() => {
    if (category_id) {
      setSelectedSkill(category_id);
    }
  }, [category_id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#C9A977" />
      </View>
    );
  }

  if (error || !teacher) {
    return (
      <View style={styles.container}>
        <Text>Error: {error || "Teacher not found"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="category_id"
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <>
            <DropDownPicker
              open={open}
              value={selectedSkill}
              items={items}
              setOpen={setOpen}
              setValue={(callback) => {
                const newValue =
                  typeof callback === "function"
                    ? callback(selectedSkill)
                    : callback;
                setSelectedSkill(newValue);
              }}
              setItems={setItems}
              placeholder="Choose skill"
              style={styles.dropDown}
            />

            {error && <Text style={styles.error}>{error.message}</Text>}
          </>
        )}
      />

      <Controller
        control={control}
        name="date"
        rules={{
          required: "Date of birth is required",
        }}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <View style={{}}>
            <View
              style={{
                flexDirection: "row-reverse",
                alignItems: "center",
                alignSelf: "flex-start",
                paddingHorizontal: 24,
                justifyContent: "space-between",
                width: "100%",
                marginBottom: 16,
              }}
            >
              <Button
                color="#C9A977"
                title={
                  value ? value.toLocaleTimeString() : "select Date of Birth"
                }
                onPress={() => setShowPickerTime(true)}
              />
              <Text
                style={{
                  color: "#999",
                  fontSize: 16,
                }}
              >
                Select Date:
              </Text>
              {showPickerTime && (
                <DateTimePicker
                  value={value}
                  mode="time"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    setShowPickerTime(false);
                    if (selectedDate) {
                      onChange(selectedDate);
                    }
                  }}
                />
              )}
              {error && <Text style={styles.error}>{error.message}</Text>}
            </View>
            <View
              style={{
                flexDirection: "row-reverse",
                alignItems: "center",
                alignSelf: "flex-start",
                paddingHorizontal: 24,
                justifyContent: "space-between",
                width: "100%",
                marginBottom: 16,
              }}
            >
              <Button
                color="#C9A977"
                title={
                  value ? value.toLocaleTimeString() : "select Date of Birth"
                }
                onPress={() => setShowPickerTime(true)}
              />
              <Text
                style={{
                  color: "#999",
                  fontSize: 16,
                }}
              >
                Select time:
              </Text>
              {showPickerTime && (
                <DateTimePicker
                  value={value}
                  mode="time"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    setShowPickerTime(false);
                    if (selectedDate) {
                      onChange(selectedDate);
                    }
                  }}
                />
              )}
              {error && <Text style={styles.error}>{error.message}</Text>}
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(SendRequest)}
        disabled={formState.isSubmitting}
      >
        <Text style={styles.buttonText}>Add Skill</Text>
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    color: "#000",
    fontSize: 16,
    alignSelf: "center",
    borderColor: "transparent",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 16,
    textAlign: "left",
    width: "90%",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    backgroundColor: "#C9A977",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
    maxWidth: 600,
    alignItems: "center",
  },
});
