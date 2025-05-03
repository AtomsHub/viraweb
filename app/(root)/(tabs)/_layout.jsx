import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MyTabBar } from "@/components/Tabbar";



export default function TabLayout() {
  return (
    <Tabs tabBar={props => <MyTabBar {...props} />}>
      <Tabs.Screen name="index" options={{title: "Home", headerShown: false}}/>
      <Tabs.Screen name="task" options={{title: "Tasks", headerShown: false}} />
      <Tabs.Screen name="history" options={{title: "History", headerShown: false}} />
      <Tabs.Screen name="account" options={{title: "Account", headerShown: false}}
      />
    </Tabs>
  );
}