import { Controller, useForm } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toast } from "react-native-toast-notifications";
import DropDownPicker from "react-native-dropdown-picker";
import { useEffect, useState } from "react";
import { apiService, Category, Skill } from "../utilities/api";
import axios from "axios";
import { router } from "expo-router";
import { useTeacher } from "../utilities/teacher-hook";

const youtubeUrlRegex =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}$/;

const authSchema = zod.object({
  category_id: zod.string().min(1, "Select category"),
  video_card_link: zod
    .string()
    .url("Have to be a link")
    .refine(
      (url) => youtubeUrlRegex.test(url),
      "Have to be a link to your YouTube video"
    ),
  about: zod.string().min(8, "Describe yourself for students!"),
});

const SkillAdding = () => {
  const { teacher, loading, error } = useTeacher();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [errorCategory, setErrorCategory] = useState<string | null>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategory(true);
        const categories = await apiService.getCategories();
        setCategories(categories);
      } catch (error) {
        setErrorCategory("Failed to fetch categories");
      } finally {
        setLoadingCategory(false);
      }
    };

    fetchCategories();
  }, []);

  const [items, setItems] = useState<Skill[]>([]);

  useEffect(() => {
    setItems(
      categories.map((category) => ({
        label: category.name,
        value: category.id.toString(),
      }))
    );
  }, [categories]);

  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      category_id: "",
      video_card_link: "",
      about: "",
    },
  });

  const skillAdd = async (data: zod.infer<typeof authSchema>) => {
    try {
      const postData = {
        category_id: Number(data.category_id),
        video_card_link: data.video_card_link,
        about: data.about,
      };
      const response = await apiService.addSkill(postData);
      Toast.show("Signed in successfully", {
        type: "success",
        placement: "top",
        duration: 1500,
      });
      router.back();
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

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Add your skill</Text>
        <Text style={styles.subtitle}>Please register your new skill:</Text>

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
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={(callback) => {
                  const newValue =
                    typeof callback === "function" ? callback(value) : callback;
                  onChange(newValue);
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
          name="video_card_link"
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <>
              <TextInput
                placeholder="link to YouTube promo video"
                style={styles.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                editable={!formState.isSubmitting}
              />
              {error && <Text style={styles.error}>{error.message}</Text>}
            </>
          )}
        />

        <Controller
          control={control}
          name="about"
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <>
              <TextInput
                placeholder="describe your skill"
                style={styles.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                editable={!formState.isSubmitting}
              />
              {error && <Text style={styles.error}>{error.message}</Text>}
            </>
          )}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(skillAdd)}
          disabled={formState.isSubmitting}
        >
          <Text style={styles.buttonText}>Add Skill</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SkillAdding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    width: "100%",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#A98957",
  },
  subtitle: {
    fontSize: 18,
    color: "#aaa",
    marginBottom: 32,
  },
  input: {
    width: "90%",
    padding: 12,
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    fontSize: 16,
    color: "#000",
  },
  dropDown: {
    width: "90%",
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    color: "#000",
    fontSize: 16,
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#C9A977",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    width: "90%",
    alignItems: "center",
  },
  signUpButton: {
    backgroundColor: "transparent",
    borderColor: "#C9A977",
    borderWidth: 1,
  },
  signUpButtonText: {
    color: "#C9A977",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 16,
    textAlign: "left",
    width: "90%",
  },
});
