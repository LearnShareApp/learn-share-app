import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import Line from "./line";
import { useTheme } from "../providers/theme-provider";
import { Review } from "../utilities/api";
const ReviewItem = ({ review }: { review: Review }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.white, { backgroundColor: theme.colors.card }]}>
      <View style={styles.top}>
        <View style={styles.horizontal}>
          <Text style={{ color: theme.colors.text }}>
            {review.user_name} {review.user_surname}
          </Text>
        </View>
        <View style={styles.horizontal}>
          <Text style={{ color: theme.colors.text }}>
            {review.rate.toFixed(1)}
          </Text>
          <FontAwesome
            size={18}
            name="star"
            style={{ color: theme.colors.primary }}
          />
        </View>
      </View>
      <Line />
      <Text style={{ color: theme.colors.text }}>{review.comment}</Text>
    </View>
  );
};

export default ReviewItem;

const styles = StyleSheet.create({
  white: {
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
