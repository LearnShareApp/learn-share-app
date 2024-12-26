import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Rooms = () => {
  return (
    <View>
      <Text>Your Lessons</Text>
      <Link href="/rooms/dede">
        <Text>frfrf</Text>
      </Link>
    </View>
  );
};

export default Rooms;

const styles = StyleSheet.create({});
