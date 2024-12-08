import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={24} {...props} style={{ color: "#C9A977" }} />;
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
              return <TabBarIcon {...props} name="home" />;
            },
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Main",
            tabBarIcon(props) {
              return <TabBarIcon {...props} name="search" />;
            },
          }}
        />
        <Tabs.Screen
          name="chats"
          options={{
            tabBarIcon(props) {
              return <TabBarIcon {...props} name="comment" />;
            },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon(props) {
              return <TabBarIcon {...props} name="user" />;
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
