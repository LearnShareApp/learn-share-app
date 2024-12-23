import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Review } from "../../assets/types/review";
import { FontAwesome } from "@expo/vector-icons";
import Line from "./line";

const ReviewItem = ({ review }: { review: Review }) => {
  return (
    <View style={styles.white}>
      <View style={styles.top}>
        <View style={styles.horizontal}>
          <Text>User Id:</Text>
          <Text>{review.userId}</Text>
        </View>
        <View style={styles.horizontal}>
          <Text>{review.grade.toFixed(1)}</Text>
          <FontAwesome size={18} name="star" style={{ color: "gold" }} />
        </View>
      </View>
      <Line />
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
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  horizontal: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
});
