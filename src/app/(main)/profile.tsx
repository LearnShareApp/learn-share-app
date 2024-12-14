import { StyleSheet, Text, View } from "react-native";
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
      <View style={styles.container}>
        <Text>Profile</Text>
      </View>
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
});
