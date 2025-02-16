import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";

const Report = () => {
  const { teacher_id } = useLocalSearchParams();
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!description.trim()) {
      Alert.alert("Ошибка", "Пожалуйста, введите описание жалобы.");
      return;
    }

    Alert.alert(
      "Жалоба отправлена",
      `Учитель ID: ${teacher_id}\nОписание: ${description}`
    );

    setDescription("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Пожаловаться на Учителя</Text>
      <Text style={styles.label}>Учитель ID: {teacher_id}</Text>

      <Text style={styles.label}>Описание жалобы:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Введите описание жалобы"
        multiline
      />
      <Button title="Отправить жалобу" onPress={handleSubmit} />
    </View>
  );
};

export default Report;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  label: {
    marginVertical: 8,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
    height: 100,
    textAlignVertical: "top",
  },
});
