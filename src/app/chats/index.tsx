import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Chats = () => {
  return (
    <View>
      <Link href="/chats/dede">
        <Text>New Chat</Text>
      </Link>
    </View>
  );
};

export default Chats;

const styles = StyleSheet.create({});
