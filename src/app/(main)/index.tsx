import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TEACHERS } from "../../../assets/teachers";
import TeacherListItem from "../../components/teacher-item";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import HeaderElement from "../../components/header-element";
import Line from "../../components/line";

const Home = () => {
  return (
    <>
      <HeaderElement
        text="Hello, Elliot!"
        requireCalendar
        requireSettings
        requireChanges={false}
      />
      <ScrollView>
        <View style={styles.container}>
          <Link href="/search" asChild>
            <Pressable style={styles.search}>
              <Text style={styles.searchText}>Try to find teacher</Text>
              <FontAwesome
                size={24}
                name="arrow-right"
                style={{ color: "#C9A977" }}
              />
            </Pressable>
          </Link>
          <View style={styles.info}>
            <Text>Your lessons</Text>
            <Line />
            <View style={styles.infoStats}>
              <View style={styles.infoSection}>
                <Text style={styles.infoNumber}>24</Text>
                <Text
                  style={{ color: "#888", width: 100, textAlign: "center" }}
                >
                  successfully finished
                </Text>
              </View>
              <View style={styles.infoSection}>
                <Text style={styles.infoNumber}>3</Text>
                <Text
                  style={{ color: "#888", width: 100, textAlign: "center" }}
                >
                  need to be approved
                </Text>
              </View>
              <View style={styles.infoSection}>
                <Text style={styles.infoNumber}>2</Text>
                <Text
                  style={{ color: "#888", width: 100, textAlign: "center" }}
                >
                  waiting for you to join
                </Text>
              </View>
            </View>
            <View style={styles.nextLessons}></View>
          </View>
          <Text style={styles.sectionText}>Your previous teachers:</Text>
          <FlatList
            data={TEACHERS}
            renderItem={({ item }) => <TeacherListItem teacher={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            stickyHeaderHiddenOnScroll
          />
        </View>
      </ScrollView>
    </>
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
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  infoStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 4,
  },
  infoSection: {
    alignItems: "center",
  },
  infoNumber: {
    fontSize: 24,
  },
  infoLine: {
    width: 1,
    height: "100%",
    backgroundColor: "#ddd",
  },
  sectionText: {
    paddingLeft: 8,
    fontSize: 18,
  },
  nextLessons: {
    width: "100%",
    height: 100,
    backgroundColor: "#eee",
    borderRadius: 12,
  },
  listContainer: {
    gap: 4,
    overflow: "visible",
  },
});
