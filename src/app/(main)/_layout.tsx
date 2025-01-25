import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "../../providers/theme-provider";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  focused: boolean;
}) {
  const { theme } = useTheme();
  return (
    <FontAwesome
      size={24}
      {...props}
      style={{ color: props.focused ? theme.colors.primary : theme.colors.text }}
    />
  );
}

const TabsLayout = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.text,
          tabBarLabelStyle: { fontSize: 16 },
          tabBarStyle: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 10,
            backgroundColor: theme.colors.card,
            borderTopColor: theme.colors.border,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Main",
            tabBarIcon(props) {
              return (
                <TabBarIcon {...props} name="home" focused={props.focused} />
              );
            },
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon(props) {
              return (
                <TabBarIcon {...props} name="search" focused={props.focused} />
              );
            },
          }}
        />
        <Tabs.Screen
          name="teaching"
          options={{
            title: "Teaching",
            tabBarIcon(props) {
              return (
                <TabBarIcon
                  {...props}
                  name="graduation-cap"
                  focused={props.focused}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon(props) {
              return (
                <TabBarIcon {...props} name="user" focused={props.focused} />
              );
            },
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
