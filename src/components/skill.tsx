import { StyleSheet, Text, View } from "react-native";

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
    padding: 8,
    borderRadius: 4,
    flexShrink: 1,
  },
  text: {
    textAlign: "center",
    color: "#444",
    fontSize: 12,
  },
});
