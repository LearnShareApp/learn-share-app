import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";

const Chats = () => {
  return (
    <View>
      <FlatList data={[3, 3, 3]} renderItem={(item) => <Text>item</Text>} />
    </View>
  );
};

export default Chats;

const styles = StyleSheet.create({});
