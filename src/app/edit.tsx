import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useLanguage } from "../providers/language-provider";
import { useTheme } from "../providers/theme-provider";
import { apiService } from "../utilities/api";
import { Toast } from "react-native-toast-notifications";
import { useProfile } from "../utilities/profile-hook";
import * as ImageManipulator from "expo-image-manipulator";
import { useAvatar } from "../utilities/avatar-hook";

const profileSchema = zod.object({
  avatar: zod.string().optional(),
  name: zod
    .string()
    .min(2, { message: "Имя должно содержать минимум 2 символа" })
    .optional(),
  surname: zod
    .string()
    .min(2, { message: "Фамилия должна содержать минимум 2 символа" })
    .optional(),
  email: zod.string().email("Неверный формат email").optional(),
  birthdate: zod.string().optional(),
});

type ProfileFormData = zod.infer<typeof profileSchema>;

const EditProfile = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const { profile, loadingProfile, errorProfile, refetch } = useProfile();
  const { avatarSource, loadingAvatar } = useAvatar(profile?.avatar ?? null);

  const { control, handleSubmit, formState } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      avatar: profile?.avatar,
      name: profile?.name,
      surname: profile?.surname,
      email: profile?.email,
      birthdate: profile?.birthdate,
    },
  });

  const handleSave = async (data: ProfileFormData) => {
    try {
      const requestData = {
        email: data.email ?? profile?.email ?? "",
        name: data.name ?? profile?.name ?? "",
        surname: data.surname ?? profile?.surname ?? "",
        birthdate: data.birthdate ?? profile?.birthdate ?? "",
        avatar: base64Image ?? "",
      };

      await apiService.updateProfile(requestData);
      Toast.show("Профиль успешно обновлен", {
        type: "success",
        placement: "top",
        duration: 1500,
      });
      refetch();
    } catch (error) {
      Toast.show("Ошибка при обновлении профиля", {
        type: "error",
        placement: "top",
        duration: 3000,
      });
    }
  };

  const [image, setImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      try {
        const manipResult = await ImageManipulator.manipulateAsync(
          imageUri,
          [{ resize: { width: 512, height: 512 } }],
          {
            compress: 0.5,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );

        setImage(manipResult.uri);
        setBase64Image(manipResult.base64 ?? "");
      } catch (error) {
        console.error("Ошибка обработки изображения:", error);
        Toast.show("Не удалось обработать изображение", {
          type: "error",
          placement: "top",
          duration: 3000,
        });
      }
    }
  };

  if (loadingProfile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={{ alignItems: "center" }}>
        <Image
          source={image ? { uri: image } : avatarSource}
          style={styles.image}
        />
        {loadingAvatar && (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        )}
        <TouchableOpacity onPress={pickImage}>
          <Text style={{ color: theme.colors.primary, paddingTop: 16 }}>
            Change photo
          </Text>
        </TouchableOpacity>
      </View>
      <Controller
        control={control}
        name="name"
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t("first_name")}
            </Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={profile?.name}
              placeholderTextColor="#aaa"
            />
            {error && (
              <Text style={{ color: theme.colors.error }}>{error.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="surname"
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t("last_name")}
            </Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={profile?.surname}
              placeholderTextColor="#aaa"
            />
            {error && (
              <Text style={{ color: theme.colors.error }}>{error.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t("email")}
            </Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={profile?.email}
              placeholderTextColor="#aaa"
            />
            {error && (
              <Text style={{ color: theme.colors.error }}>{error.message}</Text>
            )}
          </View>
        )}
      />

      <TouchableOpacity
        activeOpacity={0.6}
        style={{
          backgroundColor: theme.colors.primary,
          padding: 16,
          borderRadius: 8,
        }}
        onPress={handleSubmit(handleSave)}
        disabled={formState.isSubmitting}
      >
        <Text style={{ color: theme.colors.text, textAlign: "center" }}>
          {t("save_changes")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
});

export default EditProfile;
