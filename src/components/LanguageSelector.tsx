import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useLanguage } from "../providers/language-provider";
import type { LanguageCode } from "../locales";

const languages: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "ENG" },
  { code: "sr", label: "SRP" },
  { code: "ru", label: "RU" },
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
];

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      {languages.map((lang, index) => (
        <TouchableOpacity
          key={lang.code}
          onPress={() => setLanguage(lang.code)}
          style={[
            styles.languageButton,
            language === lang.code && styles.activeLanguage,
            index !== languages.length - 1 && styles.buttonWithBorder,
          ]}
        >
          <Text
            style={[
              styles.languageText,
              language === lang.code && styles.activeText,
            ]}
          >
            {lang.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonWithBorder: {
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
  },
  activeLanguage: {
    backgroundColor: "#C9A977",
  },
  languageText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
  },
});
