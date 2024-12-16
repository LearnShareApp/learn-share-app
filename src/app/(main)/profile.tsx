import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import HeaderElement from "../../components/header-element";

const Profile = () => {
  return (
    <>
      <HeaderElement
        text="I am"
        requireCalendar={false}
        requireChanges
        requireSettings
      />
      <ScrollView style={styles.container}>
        <View style={[styles.object, styles.user]}>
          <Image
            source={require("../../../assets/icon.png")}
            style={styles.image}
          />
          <View style={styles.userInfo}>
            <Text style={styles.user_name}>Michael Jackson</Text>
            <View style={styles.userLessons}>
              <Text>232 lessons</Text>
              <Text>243 hours learning</Text>
            </View>
          </View>
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
    paddingVertical: 12,
    position: "relative",
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
