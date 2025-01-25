import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import { useLanguage } from "../providers/language-provider";
import Line from "../components/line";
import { FontAwesome } from "@expo/vector-icons";

const About = () => {
  const { t } = useLanguage();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.title}>{t("about_us_title")}</Text>
          <Line />
          <Text style={styles.text}>{t("about_us_description")}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>{t("our_mission")}</Text>
          <Line />
          <Text style={styles.text}>{t("mission_description")}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>{t("contact_us")}</Text>
          <Line />
          <View style={styles.contactItem}>
            <FontAwesome name="envelope" size={20} color="#C9A977" />
            <Text 
              style={styles.link}
              onPress={() => Linking.openURL('mailto:jerosenkov.andrej@jjzmaj.edu.rs')}
            >
              jerosenkov.andrej@jjzmaj.edu.rs
            </Text>
          </View>
          <View style={styles.contactItem}>
            <FontAwesome name="telegram" size={20} color="#C9A977" />
            <Text 
              style={styles.link}
              onPress={() => Linking.openURL('https://t.me/andr_ewtf')}
            >
              @andr_ewtf
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>{t("version")}</Text>
          <Line />
          <Text style={styles.text}>1.0.0</Text>
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