import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  focused: boolean;
}) {
  return (
    <FontAwesome
      size={24}
      {...props}
      style={{ color: props.focused ? "#C9A977" : "grey" }}
    />
  );
}

const TabsLayout = () => {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#C9A977",
          tabBarInactiveTintColor: "grey",
          tabBarLabelStyle: { fontSize: 16 },
          tabBarStyle: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 10,
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
            title: "Main",
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
