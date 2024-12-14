import { StyleSheet, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";

const HeaderElement = ({
  text,
  requireSettings,
  requireCalendar,
  requireChanges,
}: {
  text: string;
  requireSettings: boolean;
  requireCalendar: boolean;
  requireChanges: boolean;
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.hello}>{text}</Text>
      <View style={styles.buttons}>
        {requireCalendar && (
          <FontAwesome size={24} name="calendar" style={{ color: "grey" }} />
        )}
        {requireChanges && (
          <FontAwesome
            size={24}
            name="pencil-square"
            style={{ color: "grey" }}
          />
        )}
        {requireSettings && (
          <Link href="/settings" asChild>
            <FontAwesome size={24} name="gear" style={{ color: "grey" }} />
          </Link>
        )}
      </View>
    </View>
  );
};

export default HeaderElement;

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  hello: {
    fontSize: 20,
    fontWeight: "bold",
    width: "60%",
  },
  buttons: {
    width: "20%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
