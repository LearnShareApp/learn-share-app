import { StyleSheet, Text, TouchableOpacity, View, Button } from "react-native";
import { useAuth } from "../providers/auth-provider";
import { Redirect } from "expo-router";
import { useLanguage } from "../providers/language-provider";

const Settings = () => {
  const { token, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  if (!token) return <Redirect href="/sign-in" />;

  return (
    <View style={styles.container}>
      <Text>{t('language')}</Text>
      <Button title="English" onPress={() => setLanguage('en')} />
      <Button title="Српски" onPress={() => setLanguage('sr')} />
      <Button title="Русский" onPress={() => setLanguage('ru')} />
      <Button title="Deutsch" onPress={() => setLanguage('de')} />
      <TouchableOpacity onPress={signOut} style={styles.logOut}>
        <Text style={{ textAlign: "center", fontWeight: "600" }}>
          Одјавите се
        </Text>
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
