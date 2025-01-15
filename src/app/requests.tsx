import { FlatList, StyleSheet, Text } from "react-native";

const Requests = () => {
  return (
    <FlatList
      data={[3, 3, 3, 3, 3, 3]}
      renderItem={() => <Text>skill</Text>}
      contentContainerStyle={styles.skillsList}
    />
  );
};

export default Requests;

const styles = StyleSheet.create({
  skillsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    overflow: "scroll",
  },
});
