import { Controller, Form, useForm } from "react-hook-form";
import {
  Button,
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
import { Link, Redirect } from "expo-router";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "../providers/auth-provider";
import { apiService } from "../utilities/api";
import axios from "axios";
import { useLanguage } from "../providers/language-provider";
import { LanguageSelector } from "../components/LanguageSelector";

const authSchema = zod.object({
  email: zod.string().email({ message: "Неважећа адреса " }),
  password: zod
    .string()
    .min(4, { message: "Лозинка мора да има најмање 4 знака" }),
  name: zod.string(),
  surname: zod.string(),
  birthdate: zod.date(),
});

type AuthFormData = zod.infer<typeof authSchema>;

const SignUp = () => {
  const { token, signIn } = useAuth();
  if (token) return <Redirect href={"/"} />;

  const { t } = useLanguage();

  const [showPicker, setShowPicker] = useState(false);

  const { control, handleSubmit, formState } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      surname: "",
      birthdate: new Date(),
    },
  });

  const signUp = async (data: AuthFormData) => {
    try {
      const response = await apiService.signUp(data);
      await signIn(response.token);
      Toast.show("Успешно се пријавио", {
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
        alert("Unexpected error:" + errorMessage.toString());
      } else {
        alert("Unexpected error:" + error?.toString());
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
        <Text style={styles.title}>{t("welcome")}</Text>
        <Text style={styles.subtitle}>{t("sign_up")}</Text>

        <Controller
          control={control}
          name="name"
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <>
              <TextInput
                placeholder={t("first_name")}
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
          name="surname"
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <>
              <TextInput
                placeholder={t("last_name")}
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
          name="email"
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <>
              <TextInput
                placeholder="email"
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
          name="password"
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <>
              <TextInput
                placeholder={t("password")}
                style={styles.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
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
          name="birthdate"
          rules={{
            required: t("birthdate_required"),
          }}
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <View
              style={{
                flexDirection: "row-reverse",
                alignItems: "center",
                alignSelf: "flex-start",
                paddingHorizontal: 24,
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Button
                color="#C9A977"
                title={value ? value.toDateString() : t("select_date_of_birth")}
                onPress={() => setShowPicker(true)}
              />
              <Text
                style={{
                  color: "#999",
                  fontSize: 16,
                }}
              >
                {t("your_date_of_birth")}:
              </Text>
              {showPicker && (
                <DateTimePicker
                  value={value}
                  mode="date"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    setShowPicker(false);
                    if (selectedDate) {
                      onChange(selectedDate);
                    }
                  }}
                />
              )}
              {error && <Text style={styles.error}>{error.message}</Text>}
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(signUp)}
          disabled={formState.isSubmitting}
        >
          <Text style={styles.buttonText}>{t("sign_up")}</Text>
        </TouchableOpacity>

        <Link href={"/sign-in"}>
          <Text style={[styles.buttonText, styles.signUpButtonText]}>
            {t("or_you_have_an_account")}
          </Text>
        </Link>
      </View>
      <View style={{ width: "100%", padding: 16, alignItems: "center" }}>
        <LanguageSelector />
      </View>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 8,
    alignItems: "center",
    padding: 16,
    width: "100%",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#A98957",
  },
  subtitle: {
    fontSize: 18,
    color: "#aaa",
    marginBottom: 16,
  },
  input: {
    width: "90%",
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#C9A977",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
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
