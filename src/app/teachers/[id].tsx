import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Redirect, useLocalSearchParams } from "expo-router";
import { TEACHERS } from "../../../assets/teachers";

const TeacherProfile = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const teacher = TEACHERS.find((teacher) => teacher.id === Number(id));

  if (!teacher) return <Redirect href="/" />;

  return (
    <View>
      <Text>{teacher.Name}</Text>
    </View>
  );
};

export default TeacherProfile;

const styles = StyleSheet.create({});
