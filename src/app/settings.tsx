import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../providers/auth-provider";
import { Redirect } from "expo-router";

const Settings = () => {
  const { token, signOut } = useAuth();

  if (!token) return <Redirect href="/sign-in" />;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={signOut} style={styles.logOut}>
        <Text style={{ textAlign: "center", fontWeight: "600" }}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logOut: {
    padding: 16,
    backgroundColor: "#f78852",
    borderRadius: 12,
  },
});
