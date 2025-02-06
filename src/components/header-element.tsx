import { Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useTheme } from "../providers/theme-provider";

const HeaderElement = ({
  text,
  requireSettings,
  requireCalendar,
  requireChanges,
}: {
  text: string;
  requireSettings?: boolean;
  requireCalendar?: boolean;
  requireChanges?: boolean;
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.hello, { color: theme.colors.text }]}>{text}</Text>
      <View style={styles.buttons}>
        {requireCalendar && (
          <Link href="/rooms">
            <FontAwesome
              size={24}
              name="calendar"
              style={{ color: theme.colors.primary }}
            />
          </Link>
        )}
        {requireChanges && (
          <Link href="/edit" asChild>
            <Pressable>
              <FontAwesome
                size={28}
                name="pencil-square"
                style={{ color: theme.colors.primary }}
              />
            </Pressable>
          </Link>
        )}
        {requireSettings && (
          <Link href="/settings" asChild>
            <Pressable>
              <FontAwesome
                size={28}
                name="gear"
                style={{ color: theme.colors.primary }}
              />
            </Pressable>
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
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
  },
  hello: {
    fontSize: 20,
    fontWeight: "600",
    width: "60%",
  },
  buttons: {
    width: "30%",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    paddingTop: 4,
  },
});
