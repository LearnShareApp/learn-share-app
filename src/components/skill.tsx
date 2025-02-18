import { StyleSheet, Text, View } from "react-native";

const SkillBadge = ({
  text,
  inactive,
}: {
  text: String;
  inactive?: boolean;
}) => {
  return (
    <View
      style={!inactive ? styles.skillContainer : styles.skillContainerInactive}
    >
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
  skillContainerInactive: {
    borderColor: "#FFDFAF",
    borderWidth: 1,
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
