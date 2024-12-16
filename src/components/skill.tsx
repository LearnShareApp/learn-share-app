import { StyleSheet, Text, View } from "react-native";
import React from "react";

const SkillBadge = ({ text }: { text: String }) => {
  return (
    <View style={styles.skillContainer}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default SkillBadge;

const styles = StyleSheet.create({
  skillContainer: {
    backgroundColor: "#FFDFAF",
    padding: 4,
    borderRadius: 4,
  },
  text: {
    color: "#555",
    fontSize: 12,
  },
});
