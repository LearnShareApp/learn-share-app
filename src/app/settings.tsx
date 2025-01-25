import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../providers/auth-provider";
import { Redirect } from "expo-router";
import { useLanguage } from "../providers/language-provider";
import { LanguageSelector } from "../components/LanguageSelector";

const Settings = () => {
  const { token, signOut } = useAuth();
  const { t } = useLanguage();

  if (!token) return <Redirect href="/sign-in" />;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('language')}</Text>
      <LanguageSelector />
      
      <TouchableOpacity onPress={signOut} style={styles.logOut}>
        <Text style={{ textAlign: "center", fontWeight: "600", color: "#fff" }}>
          {t('log_out')}
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
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  logOut: {
    padding: 16,
    backgroundColor: "#f78852",
    borderRadius: 12,
    marginTop: "auto",
  },
});
