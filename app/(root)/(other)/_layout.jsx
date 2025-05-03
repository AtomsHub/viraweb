
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="about" options={{ headerShown: false, headerShadowVisible: false }} />
        <Stack.Screen name="changePassword" options={{ headerShown: false, headerShadowVisible: false }} />
        <Stack.Screen name="profileDetails" options={{ headerShown: false, headerShadowVisible: false }} />
        <Stack.Screen name="socialMedia" options={{ headerShown: false, headerShadowVisible: false }} />
        <Stack.Screen name="bankDetails" options={{ headerShown: false, headerShadowVisible: false }} />
      </Stack>
      <StatusBar style="light" backgroundColor='#852E45' />
    </>
  );
};

export default AuthLayout;
