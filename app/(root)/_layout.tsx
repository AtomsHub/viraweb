import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(redeem)" options={{ headerShown: false }} />
      <Stack.Screen name="(other)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
