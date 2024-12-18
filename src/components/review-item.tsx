import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Review } from "../../assets/types/review";

const ReviewItem = ({ review }: { review: Review }) => {
  return (
    <View style={styles.white}>
      <View></View>
      <Text>{review.text}</Text>
    </View>
  );
};

export default ReviewItem;

const styles = StyleSheet.create({
  white: {
    backgroundColor: "white",
    borderRadius: 8,
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
