import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import TeacherListItem from "../../components/teacher-item";
import { apiService, Skill, TeacherProfile } from "../../utilities/api";
import DropDownPicker from "react-native-dropdown-picker";
import { useCategories } from "../../utilities/category-hook";
import { Toast } from "react-native-toast-notifications";

const Search = () => {
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dropdownItems, setDropdownItems] = useState<Skill[]>([]);

  const { categories, loadingCategories } = useCategories();

  // Загрузка учителей
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const response = await apiService.getTeachers();
        console.log("API Response:", response); // Смотрим что приходит
        console.log("Response type:", typeof response); // Проверяем тип данных
        console.log("Is Array:", Array.isArray(response));
        setTeachers(response || []);
      } catch (err) {
        console.error("Error details:", err);
        setError("Failed to fetch teachers");
        Toast.show("Failed to load teachers", {
          type: "error",
          placement: "top",
          duration: 3000,
        });
        setTeachers([]); // Устанавливаем пустой массив при ошибке
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    if (categories) {
      const items: Skill[] = categories.map((category) => ({
        label: category.name,
        value: category.id.toString(),
      }));
      setDropdownItems(items);
    }
  }, [categories]);

  const filteredTeachers = React.useMemo(() => {
    return teachers.filter((teacher) => {
      const matchesSearch =
        `${teacher.name.toLowerCase()} ${teacher.surname.toLowerCase()}`.includes(
          searchText.toLowerCase()
        );

      const matchesCategory = selectedCategory
        ? teacher.skills.some(
            (skill) => skill.category_id.toString() === selectedCategory
          )
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [teachers, searchText, selectedCategory]);

  if (loading || loadingCategories) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <TextInput
          style={styles.input}
          placeholder="Try to find a teacher"
          onChangeText={setSearchText}
          value={searchText}
        />
        <FontAwesome size={24} name="search" style={{ color: "#C9A977" }} />
      </View>

      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={open}
          value={selectedCategory}
          items={dropdownItems}
          setOpen={setOpen}
          setValue={setSelectedCategory}
          setItems={setDropdownItems}
          placeholder="Choose category"
          style={styles.dropdown}
        />
      </View>

      {filteredTeachers.length === 0 ? (
        <Text style={styles.noResults}>No teachers found</Text>
      ) : (
        <FlatList
          data={filteredTeachers}
          renderItem={({ item }) => <TeacherListItem teacher={item} />}
          keyExtractor={(item) => item.teacher_id.toString()}
          contentContainerStyle={styles.listContainer}
          stickyHeaderHiddenOnScroll
        />
      )}
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
  dropdownContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
  },
  dropdown: {
    borderColor: "transparent",
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});
