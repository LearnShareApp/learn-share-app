import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { TEACHERS } from "../../../assets/teachers";
import TeacherListItem from "../../components/teacher-item";
import { Link } from "expo-router";

const Home = () => {
  return (
    <View style={styles.container}>
      <Text>Hello, Eliot!</Text>
      <Link href="/search" asChild>
        <Pressable style={styles.search}>
          <Text></Text>
        </Pressable>
      </Link>
      <View style={styles.info}></View>
      <FlatList
        data={TEACHERS}
        renderItem={({ item }) => <TeacherListItem teacher={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 8,
  },
  search: {
    width: "100%",
    height: 60,
    backgroundColor: "white",
    borderRadius: 8,
  },
  info: {
    width: "100%",
    height: 60,
    backgroundColor: "white",
    borderRadius: 8,
  },
  listContainer: {
    gap: 4,
  },
});
