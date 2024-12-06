import { FlatList, StyleSheet, Text, View } from "react-native";
import { TEACHERS } from "../../../assets/teachers";
import TeacherListItem from "../../components/teacher-item";

const Home = () => {
  return (
    <View>
      <Text>Home</Text>
      <FlatList
        data={TEACHERS}
        renderItem={({ item }) => <TeacherListItem teacher={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        style={{ paddingHorizontal: 10, paddingVertical: 5 }}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  listContainer: {
    gap: 4,
  },
});
