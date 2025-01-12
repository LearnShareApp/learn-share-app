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
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { Link, Redirect } from "expo-router";

import apiClient from "../utilities/api";
import { useToken } from "../providers/tokenProvider";
const BACKEND_URL = "http://192.168.1.8:8080";

const authSchema = zod.object({
  email: zod.string().email({ message: "Invalid email address" }),
  password: zod
    .string()
    .min(4, { message: "Password must be at least 8 characters long" }),
});

const Auth = () => {
  const { token, setToken } = useToken();

  if (token) return <Redirect href={"/"} />;

  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const signIn = async (data: zod.infer<typeof authSchema>) => {
  //   try {
  //     const response = await apiClient.post("/auth/login", data); // Укажите нужный эндпоинт
  //     console.log("Login successful:", response.data);
  //     Toast.show("Signed in successfully", {
  //       type: "success",
  //       placement: "top",
  //       duration: 1500,
  //     });

  //     // Сохранение токена в Secure Store
  //     await SecureStore.setItemAsync("authToken", response.data);
  //   } catch (error) {
  //     console.error("Error during login:", error);
  //     alert(error);
  //   }
  // };

  const signIn = async (data: zod.infer<typeof authSchema>) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/login`, data);
      console.log(response.data);
      Toast.show("Signed in successfully", {
        type: "success",
        placement: "top",
        duration: 1500,
      });
      setToken(response.data);
    } catch (error) {
      console.error("Error sending data:", error);
      alert(error);
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Please Authenticate to continue</Text>

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
                placeholder="password"
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

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(signIn)}
          disabled={formState.isSubmitting}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <Link href={"/sign-up"}>
          <Text style={[styles.buttonText, styles.signUpButtonText]}>
            or Sign Up
          </Text>
        </Link>
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
