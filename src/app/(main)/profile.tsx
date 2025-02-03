import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link } from "expo-router";
import * as Clipboard from "expo-clipboard";
import HeaderElement from "../../components/header-element";
import { FontAwesome } from "@expo/vector-icons";
import SkillBadge from "../../components/skill";
import Line from "../../components/line";
import { useProfile } from "../../utilities/profile-hook";
import { useLanguage } from "../../providers/language-provider";
import { useTheme } from "../../providers/theme-provider";
import { useAvatar } from "../../utilities/avatar-hook";

const Profile = () => {
  const { profile, loadingProfile, errorProfile } = useProfile();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { avatarSource, loadingAvatar } = useAvatar(profile?.avatar ?? null);

  if (loadingProfile) {
    return (
      <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>

        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  if (errorProfile) {
    return (
      <Text
        style={{
          color: theme.colors.error,
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        Error: {errorProfile}
      </Text>
    );
  }

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(
      "https://www.youtube.com/watch?v=jNQXAC9IVRw"
    );
  };

  return (
    <>
      <HeaderElement
        text={t("i_am")}
        requireCalendar={false}
        requireChanges
        requireSettings
      />
      <ScrollView style={{ backgroundColor: theme.colors.background }}>
        <View style={styles.container}>
          <View
            style={[
              styles.object,
              {
                backgroundColor: theme.colors.card,
                flexDirection: "row",
                gap: 16,
              },
            ]}
          >
            <Image
              source={avatarSource}
              style={styles.image}
              onError={(e) => console.error('Image loading error:', e.nativeEvent.error)}
            />
            <View style={styles.userInfo}>
              <Text
                style={[
                  styles.user_name,
                  { color: theme.colors.text, fontSize: 16 },
                ]}
              >
                {profile?.name} {profile?.surname}
              </Text>
              <Text style={{ color: "#888", fontSize: 12 }}>
                {profile?.email}
              </Text>
              <Text style={{ color: theme.colors.text, fontSize: 16 }}>
                {t("participant_of_the_world_of_learning")}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.object,
              styles.huge,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <Text
              style={{ width: "80%", fontSize: 16, color: theme.colors.text }}
            >
              {t("learning_progress")}
            </Text>
            <Line />
            <View style={styles.infoSections}>
              <View style={styles.infoSection}>
                <Text style={{ textAlign: "center", color: theme.colors.text }}>
                  {t("learning_hours")}
                </Text>
                <Text style={{ fontSize: 24, color: theme.colors.text }}>
                  0
                </Text>
              </View>
              <View style={styles.infoSection}>
                <Text style={{ textAlign: "center", color: theme.colors.text }}>
                  {t("lessons_completed")}
                </Text>
                <Text style={{ fontSize: 24, color: theme.colors.text }}>
                  0
                </Text>
              </View>
            </View>
            <Text style={{ color: theme.colors.text }}>
              {t("skills_you_learned")}:
            </Text>
            <Line />
            <View style={styles.skillList}>
              <SkillBadge text={t("start_learning")} />
            </View>
          </View>

          <View
            style={[
              styles.object,
              styles.huge,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <Text
              style={{ width: "80%", fontSize: 16, color: theme.colors.text }}
            >
              {t("your_wallet")}
            </Text>
            <Line />
            <Text style={{ fontSize: 10, color: theme.colors.text }}>
              {t("balance_title")}
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{ width: "50%", fontSize: 18, color: theme.colors.text }}
              >
                {t("in_development")}
              </Text>
              <Pressable
                style={{
                  backgroundColor: theme.colors.primary,
                  padding: 6,
                  width: 100,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    verticalAlign: "middle",
                    textAlign: "center",
                    color: theme.colors.buttonText,
                  }}
                >
                  {t("top_up")}
                </Text>
              </Pressable>
            </View>
          </View>

          <Link href="/teaching" asChild>
            <Pressable>
              <View
                style={[
                  styles.object,
                  styles.oneLine,
                  { backgroundColor: theme.colors.card },
                ]}
              >
                <Text
                  style={{
                    width: "80%",
                    fontSize: 16,
                    color: theme.colors.text,
                  }}
                >
                  {t("become_teacher")}
                </Text>
                <View style={styles.iconContainer}>
                  <FontAwesome
                    size={24}
                    name="graduation-cap"
                    style={{ color: theme.colors.primary }}
                  />
                </View>
              </View>
            </Pressable>
          </Link>

          <Link href="/settings" asChild>
            <Pressable>
              <View
                style={[
                  styles.object,
                  styles.oneLine,
                  { backgroundColor: theme.colors.card },
                ]}
              >
                <Text
                  style={{
                    width: "80%",
                    fontSize: 16,
                    color: theme.colors.text,
                  }}
                >
                  {t("settings")}
                </Text>
                <View style={styles.iconContainer}>
                  <FontAwesome
                    size={24}
                    name="gear"
                    style={{ color: theme.colors.primary }}
                  />
                </View>
              </View>
            </Pressable>
          </Link>

          <Link href="/about" asChild>
            <Pressable>
              <View
                style={[
                  styles.object,
                  styles.oneLine,
                  { backgroundColor: theme.colors.card },
                ]}
              >
                <Text
                  style={{
                    width: "80%",
                    fontSize: 16,
                    color: theme.colors.text,
                  }}
                >
                  {t("about")}
                </Text>
                <View style={styles.iconContainer}>
                  <FontAwesome
                    size={24}
                    name="info"
                    style={{ color: theme.colors.primary }}
                  />
                </View>
              </View>
            </Pressable>
          </Link>

          <Pressable
            onPress={copyToClipboard}
            style={[styles.object, { backgroundColor: theme.colors.primary }]}
          >
            <Text
              style={{ textAlign: "center", color: theme.colors.buttonText }}
            >
              {t("invite_friends")}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  object: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    position: "relative",
  },
  huge: {
    gap: 8,
  },
  infoSections: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoSection: {
    alignItems: "center",
    width: "48%",
  },
  skillList: {
    flexDirection: "row",
    gap: 8,
  },
  oneLine: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconContainer: {
    width: 32,
    alignItems: "center",
  },
  user: {
    gap: 16,
    flexDirection: "row",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee'
  },
  userInfo: {
    flex: 1,
  },
  user_name: {
    fontSize: 18,
  },
  userLessons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default Profile;
