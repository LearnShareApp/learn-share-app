import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { TEACHERS } from "../../../assets/teachers";
import TeacherListItem from "../../components/teacher-item";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
const BACKEND_URL = "http://192.168.1.8:8080";

const Search = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/categories`);
        setCategories(response.data);
        console.log(response.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        } else {
          setError("unknown error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const [text, onChangeText] = React.useState("");
  const teachers = TEACHERS.filter((teacher) =>
    `${teacher.Name.toLowerCase()} ${teacher.Surname.toLowerCase()}`.includes(
      text.toLowerCase()
    )
  );

  if (loading) {
    return <Text>Загрузка...</Text>;
  }

  if (error) {
    return <Text>Ошибка: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <TextInput
          style={styles.input}
          placeholder="try to find a teacher"
          onChangeText={onChangeText}
          value={text}
        />
        <FontAwesome size={24} name="search" style={{ color: "#C9A977" }} />
      </View>

      <View></View>

      <FlatList
        data={teachers}
        renderItem={({ item }) => <TeacherListItem teacher={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        stickyHeaderHiddenOnScroll
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 8,
    paddingBottom: 74,
  },
  input: {
    height: 40,
    width: "80%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: "transparent",
    paddingHorizontal: 0,
  },
  search: {
    width: "100%",
    height: 60,
    backgroundColor: "white",
    borderRadius: 16,
    paddingRight: 16,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listContainer: {
    gap: 4,
    overflow: "visible",
  },
});
