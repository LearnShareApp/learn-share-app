import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import { useLanguage } from "../providers/language-provider";
import Line from "../components/line";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "../providers/theme-provider";

const About = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.content, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{t("about_us_title")}</Text>
          <Line />
          <Text style={[styles.text, { color: theme.colors.text }]}>{t("about_us_description")}</Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{t("our_mission")}</Text>
          <Line />
          <Text style={[styles.text, { color: theme.colors.text }]}>{t("mission_description")}</Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{t("contact_us")}</Text>
          <Line />
          <View style={styles.contactItem}>
            <FontAwesome name="envelope" size={20} color="#C9A977" />
            <Text 
              style={[styles.link, { color: theme.colors.text }]}
              onPress={() => Linking.openURL('mailto:learnandshareapp@gmail.com')}
            >
              learnandshareapp@gmail.com
            </Text>
          </View>
          <View style={styles.contactItem}>
            <FontAwesome name="telegram" size={20} color="#C9A977" />
            <Text 
              style={[styles.link, { color: theme.colors.text }]}
              onPress={() => Linking.openURL('https://t.me/andr_ewtf')}
            >
              @andr_ewtf
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{t("version")}</Text>
          <Line />
          <Text style={[styles.text, { color: theme.colors.text }]}>1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
    gap: 16,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  link: {
    color: "#C9A977",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default About; 