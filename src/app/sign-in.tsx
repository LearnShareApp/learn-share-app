import { Controller, useForm } from "react-hook-form";
import {
  StyleSheet,
  Switch,
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
import { useAuth } from "../providers/auth-provider";
import { apiService } from "../utilities/api";
import axios from "axios";
import { useLanguage } from "../providers/language-provider";
import { LanguageSelector } from "../components/LanguageSelector";
import { useTheme } from "../providers/theme-provider";

const authSchema = zod.object({
  email: zod.string().email({ message: "Неважећа адреса" }),
  password: zod
    .string()
    .min(4, { message: "Лозинка мора да има најмање 4 знака" }),
});

type AuthFormData = zod.infer<typeof authSchema>;

const Auth = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { token, signIn } = useAuth();
  if (token) return <Redirect href="/" />;

  const { t } = useLanguage();

  const { control, handleSubmit, formState } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInFunction = async (data: AuthFormData) => {
    try {
      const response = await apiService.login(data);
      await signIn(response.token);
      Toast.show(t("successfully_signed_in"), {
        type: "success",
        placement: "top",
        duration: 1500,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || t("an_unknown_error_occurred");
        Toast.show(errorMessage, {
          type: "warning",
          placement: "top",
          duration: 3000,
          swipeEnabled: true,
        });
        console.log(errorMessage);
      } else {
        console.error("Unexpected error:", error);
        Toast.show(t("an_unexpected_error_occurred"), {
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
        <Text style={styles.subtitle}>{t("enter_credentials")}</Text>

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
                autoComplete="email"
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
                autoComplete="password"
              />
              {error && <Text style={styles.error}>{error.message}</Text>}
            </>
          )}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(signInFunction)}
          disabled={formState.isSubmitting}
        >
          <Text style={styles.buttonText}>{t("sign_in")}</Text>
        </TouchableOpacity>

        <Link href={"/sign-up"}>
          <Text style={[styles.buttonText, styles.signUpButtonText]}>
            {t("or_register_a_new_account")}
          </Text>
        </Link>
      </View>
      <View style={{ width: "100%", padding: 16, alignItems: "center" }}>
        <LanguageSelector />
      </View>
    </SafeAreaView>
  );
};

export default Auth;

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
    textAlign: "center",
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
    textAlign: "center",
    width: "70%",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    width: "80%",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 16,
    textAlign: "left",
    width: "90%",
  },
});
