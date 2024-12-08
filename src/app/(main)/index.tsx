import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { TEACHERS } from "../../../assets/teachers";
import TeacherListItem from "../../components/teacher-item";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import HeaderElement from "../../components/header-element";

const Home = () => {
  return (
    <View style={styles.container}>
      <HeaderElement
        text="Hello, Eliot!"
        requireCalendar
        requireSettings
        requireChanges={false}
      />
      <Link href="/search" asChild>
        <Pressable style={styles.search}>
          <Text style={styles.searchText}>Try to find teacher</Text>
          <FontAwesome size={24} name="search" style={{ color: "#C9A977" }} />
        </Pressable>
      </Link>
      <View style={styles.info}></View>
      <Text style={styles.sectionText}>Your previous teachers:</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchText: {
    fontSize: 14,
    width: 200,
  },
  info: {
    width: "100%",
    height: 60,
    backgroundColor: "white",
    borderRadius: 8,
  },
  sectionText: {
    paddingLeft: 8,
    fontSize: 18,
  },
  listContainer: {
    gap: 4,
  },
});
