import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../providers/auth-provider";
import { Redirect } from "expo-router";
import { useLanguage } from "../providers/language-provider";
import { LanguageSelector } from "../components/LanguageSelector";
import { useTheme } from "../providers/theme-provider";

const Settings = () => {
  const { token, signOut } = useAuth();
  const { t } = useLanguage();
  const { theme, isDark, toggleTheme } = useTheme();

  if (!token) return <Redirect href="/sign-in" />;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {t('language')}
        </Text>
        <LanguageSelector />
      </View>

      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <View style={styles.themeContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('dark_mode')}
          </Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: theme.colors.primary }}
            thumbColor={isDark ? theme.colors.card : "#f4f3f4"}
          />
        </View>
      </View>
      
      <TouchableOpacity 
        onPress={signOut} 
        style={[styles.logOut, { backgroundColor: theme.colors.error }]}
      >
        <Text style={[styles.logOutText, { color: theme.colors.buttonText }]}>
          {t('log_out')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  section: {
    borderRadius: 8,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  themeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logOut: {
    padding: 16,
    borderRadius: 12,
    marginTop: "auto",
  },
  logOutText: {
    textAlign: "center",
    fontWeight: "600",
  },
});

export default Settings;
