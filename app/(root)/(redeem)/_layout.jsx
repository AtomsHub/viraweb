
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false, headerShadowVisible: false }} />
        <Stack.Screen name="airtime" options={{ headerShown: false, headerShadowVisible: false }} />
        <Stack.Screen name="data" options={{ headerShown: false, headerShadowVisible: false }} />
        <Stack.Screen name="bankTransfer" options={{ headerShown: false, headerShadowVisible: false,  }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
};

export default AuthLayout;
