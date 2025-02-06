import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import TeacherListItem from "../../components/teacher-item";
import { apiService, Skill, TeacherProfile } from "../../utilities/api";
import DropDownPicker from "react-native-dropdown-picker";
import { useCategories } from "../../utilities/category-hook";
import { Toast } from "react-native-toast-notifications";
import { useLanguage } from "../../providers/language-provider";
import { useTheme } from "../../providers/theme-provider";

const Search = () => {
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dropdownItems, setDropdownItems] = useState<Skill[]>([]);

  const { categories, loadingCategories } = useCategories();
  const { t } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const response = await apiService.getTeachers();
        setTeachers(response || []);
      } catch (err) {
        console.error("Error details:", err);
        setError(t("failed_fetch_teachers"));
        Toast.show(t("failed_load_teachers"), {
          type: "error",
          placement: "top",
          duration: 3000,
        });
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    if (categories) {
      const items: Skill[] = [
        { label: t("All"), value: null },
        ...categories.map((category) => ({
          label: category.name,
          value: category.id.toString(),
        })),
      ];
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
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.background, flex: 1 },
        ]}
      >
        <View style={[styles.search, { backgroundColor: theme.colors.card }]}>
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder={t("search_teacher")}
            placeholderTextColor={theme.colors.text}
            onChangeText={setSearchText}
            value={searchText}
          />
          <FontAwesome
            size={24}
            name="search"
            style={{ color: theme.colors.primary }}
          />
        </View>
        <View
          style={[
            styles.dropdownContainer,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <DropDownPicker
            open={open}
            value={selectedCategory}
            items={[]}
            dropDownContainerStyle={{
              borderColor: "transparent",
              backgroundColor: theme.colors.card,
            }}
            setOpen={setOpen}
            setValue={setSelectedCategory}
            setItems={setDropdownItems}
            placeholder={t("loading")}
            style={[styles.dropdown, { backgroundColor: theme.colors.card }]}
            textStyle={{ color: theme.colors.text }}
          />
        </View>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <Text
        style={{
          color: theme.colors.error,
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        Error: {error}
      </Text>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={[styles.search, { backgroundColor: theme.colors.card }]}>
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          placeholder={t("search_teacher")}
          placeholderTextColor={theme.colors.text}
          onChangeText={setSearchText}
          value={searchText}
        />
        <FontAwesome
          size={24}
          name="search"
          style={{ color: theme.colors.primary }}
        />
      </View>

      <View
        style={[
          styles.dropdownContainer,
          { backgroundColor: theme.colors.card },
        ]}
      >
        <DropDownPicker
          open={open}
          value={selectedCategory}
          items={dropdownItems}
          setOpen={setOpen}
          setValue={setSelectedCategory}
          setItems={setDropdownItems}
          placeholder={t("choose_category")}
          style={[styles.dropdown, { backgroundColor: theme.colors.card }]}
          dropDownContainerStyle={{
            borderColor: "transparent",
            backgroundColor: theme.colors.card,
          }}
          textStyle={{ color: theme.colors.text }}
        />
      </View>

      {filteredTeachers.length === 0 ? (
        <Text style={[styles.noResults, { color: theme.colors.text }]}>
          {t("no_teachers_found")}
        </Text>
      ) : (
        <FlatList
          data={filteredTeachers}
          renderItem={({ item }) => (
            <TeacherListItem
              teacher={item}
              {...(selectedCategory && {
                category: selectedCategory,
              })}
            />
          )}
          keyExtractor={(item) => item.teacher_id.toString()}
          contentContainerStyle={styles.listContainer}
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 8,
    paddingBottom: 8,
    flex: 1,
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
    borderRadius: 16,
    paddingRight: 16,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listContainer: {
    gap: 8,
  },
  dropdownContainer: {
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
  },
});

export default Search;
