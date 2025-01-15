import {
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

const Profile = () => {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return <HeaderElement text="Loading..." requireChanges requireSettings />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync("https://youtube.com");
  };

  return (
    <>
      <HeaderElement
        text="I am"
        requireCalendar={false}
        requireChanges
        requireSettings
      />
      <ScrollView>
        <View style={styles.container}>
          <View style={[styles.object, styles.user]}>
            <Image
              source={require("../../../assets/icon.png")}
              style={styles.image}
            />
            <View style={styles.userInfo}>
              <Text style={styles.user_name}>
                {profile?.name} {profile?.surname}
              </Text>
              <Text>200d since joining the study world</Text>
            </View>
          </View>

          <View style={[styles.object, styles.huge]}>
            <Text style={{ width: "80%", fontSize: 16 }}>
              Studying progress
            </Text>
            <Line />
            <View style={styles.infoSections}>
              <View style={styles.infoSection}>
                <Text style={{ textAlign: "center" }}>Hours of studying</Text>
                <Text style={{ fontSize: 24 }}>200</Text>
              </View>
              <View style={styles.infoSection}>
                <Text style={{ textAlign: "center" }}>
                  Classes been finished
                </Text>
                <Text style={{ fontSize: 24 }}>130</Text>
              </View>
            </View>
            <Text>Skills you've been learning:</Text>
            <Line />
            <View style={styles.skillList}>
              <SkillBadge text="programming" />
              <SkillBadge text="cooking" />
              <SkillBadge text="english" />
            </View>
          </View>

          <View style={[styles.object, styles.huge]}>
            <Text style={{ width: "80%", fontSize: 16 }}>Your Wallet</Text>
            <Line />
            <Text style={{ fontSize: 10 }}>Ballance</Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ width: "50%", fontSize: 18 }}>---,-- RSD</Text>
              <Pressable
                style={{
                  backgroundColor: "#FFDFAF",
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
                  }}
                >
                  Book lesson
                </Text>
              </Pressable>
            </View>
          </View>

          <Link href="/teaching" asChild>
            <Pressable>
              <View style={[styles.object, styles.oneLine]}>
                <Text style={{ width: "80%", fontSize: 16 }}>
                  Become teacher
                </Text>
                <View style={styles.iconContainer}>
                  <FontAwesome
                    size={24}
                    name="graduation-cap"
                    style={{ color: "#C9A977" }}
                  />
                </View>
              </View>
            </Pressable>
          </Link>

          <Link href="/settings" asChild>
            <Pressable>
              <View style={[styles.object, styles.oneLine]}>
                <Text style={{ width: "80%", fontSize: 16 }}>Options</Text>
                <View style={styles.iconContainer}>
                  <FontAwesome
                    size={24}
                    name="gear"
                    style={{ color: "#C9A977" }}
                  />
                </View>
              </View>
            </Pressable>
          </Link>

          <Link href="/about" asChild>
            <Pressable>
              <View style={[styles.object, styles.oneLine]}>
                <Text style={{ width: "80%", fontSize: 16 }}>About us</Text>
                <View style={styles.iconContainer}>
                  <FontAwesome
                    size={24}
                    name="info"
                    style={{ color: "#C9A977" }}
                  />
                </View>
              </View>
            </Pressable>
          </Link>

          <Pressable
            onPress={copyToClipboard}
            style={[styles.object, { backgroundColor: "#FFDFAF" }]}
          >
            {/* <FontAwesome size={24} name="copy" style={{ color: "#C9A977" }} /> */}
            <Text style={{ textAlign: "center" }}>
              Invite your friends to study with you!{" "}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 8,
  },
  object: {
    backgroundColor: "white",
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
    width: 64,
    height: 64,
    borderRadius: 50,
  },
  userInfo: {
    paddingTop: 4,
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
