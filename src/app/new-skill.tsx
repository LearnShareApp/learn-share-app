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
import { useLanguage } from "../providers/language-provider";

const youtubeUrlRegex =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}(\?.*)?$/;

const SkillAdding = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [errorCategory, setErrorCategory] = useState<string | null>(null);

  const [open, setOpen] = useState(false);

  const authSchema = zod.object({
    category_id: zod.string().min(1, "Select category"),
    video_card_link: zod
      .string()
      .url(t("have_to_be_a_link"))
      .refine(
        (url) => youtubeUrlRegex.test(url),
        t("have_to_be_a_link_to_your_youtube_video")
      )
      .transform((url) => {
        const match = url.match(
          /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        );
        const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : shortMatch ? shortMatch[1] : url;
      }),
    about: zod.string().min(8, t("describe_your_skill")),
  });

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
      Toast.show(t("request_success"), {
        type: "success",
        placement: "top",
        duration: 1500,
      });
      router.back();
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

    const { teacher } = useTeacher();
    if (teacher) null;
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>{t("add_skill")}</Text>
        <Text style={styles.subtitle}>{t("register_new_skill")}</Text>

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
                placeholder={t("select_category")}
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
                placeholder={t("youtube_link")}
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
                placeholder={t("describe_your_skill")}
                style={styles.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                editable={!formState.isSubmitting}
                multiline={true}
              />
              {error && <Text style={styles.error}>{error.message}</Text>}
            </>
          )}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(skillAdd)}
          disabled={formState.isSubmitting}
          activeOpacity={0.6}
        >
          <Text style={styles.buttonText}>{t("add_skill")}</Text>
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
    borderColor: "transparent",
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
