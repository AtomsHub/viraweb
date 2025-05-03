import { useCallback, useEffect, useState } from 'react';
import { Stack, usePathname, useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { Toaster } from 'burnt/web';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import '../global.css';
import { checkToken, retrieveData } from '@/utils/api';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 2500,
  fade: true,
});

const NO_CHECK_TOKEN = [
  '/sign-in',
  '/sign-up',
  '/verify',
  '/welcome',
];

export default function RootLayout() {
  const [loaded] = useFonts({
    // Regular MonaSans
    "Mona-ExtraLight": require("../assets/fonts/MonaSans-ExtraLight.ttf"),
    "Mona-Light": require("../assets/fonts/MonaSans-Light.ttf"),
    "Mona-Regular": require("../assets/fonts/MonaSans-Regular.ttf"),
    "Mona-Medium": require("../assets/fonts/MonaSans-Medium.ttf"),
    "Mona-SemiBold": require("../assets/fonts/MonaSans-SemiBold.ttf"),
    "Mona-Bold": require("../assets/fonts/MonaSans-Bold.ttf"),
    "Mona-ExtraBold": require("../assets/fonts/MonaSans-ExtraBold.ttf"),
    "Mona-Black": require("../assets/fonts/MonaSans-Black.ttf"),
    "Mona-Italic": require("../assets/fonts/MonaSans-Italic.ttf"),

    // Condensed MonaSans
    "Mona-Condensed-ExtraLight": require("../assets/fonts/MonaSans_Condensed-ExtraLight.ttf"),
    "Mona-Condensed-Light": require("../assets/fonts/MonaSans_Condensed-Light.ttf"),
    "Mona-Condensed-Regular": require("../assets/fonts/MonaSans_Condensed-Regular.ttf"),
    "Mona-Condensed-Medium": require("../assets/fonts/MonaSans_Condensed-Medium.ttf"),
    "Mona-Condensed-SemiBold": require("../assets/fonts/MonaSans_Condensed-SemiBold.ttf"),
    "Mona-Condensed-Bold": require("../assets/fonts/MonaSans_Condensed-Bold.ttf"),
    "Mona-Condensed-ExtraBold": require("../assets/fonts/MonaSans_Condensed-ExtraBold.ttf"),
    "Mona-Condensed-Black": require("../assets/fonts/MonaSans_Condensed-Black.ttf"),

    // Expanded MonaSans
    "Mona-Expanded-ExtraLight": require("../assets/fonts/MonaSans_Expanded-ExtraLight.ttf"),
    "Mona-Expanded-Light": require("../assets/fonts/MonaSans_Expanded-Light.ttf"),
    "Mona-Expanded-Regular": require("../assets/fonts/MonaSans_Expanded-Regular.ttf"),
    "Mona-Expanded-Medium": require("../assets/fonts/MonaSans_Expanded-Medium.ttf"),
    "Mona-Expanded-SemiBold": require("../assets/fonts/MonaSans_Expanded-SemiBold.ttf"),
    "Mona-Expanded-Bold": require("../assets/fonts/MonaSans_Expanded-Bold.ttf"),
    "Mona-Expanded-ExtraBold": require("../assets/fonts/MonaSans_Expanded-ExtraBold.ttf"),
    "Mona-Expanded-Black": require("../assets/fonts/MonaSans_Expanded-Black.ttf"),
  });

  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [userPackage, setUserPackage] = useState(null);
  const [emptyField, setEmptyField] = useState(null);

  const fetchUserSubscription = async () => {
    try {
      const userResponse = await retrieveData('userResponse');
      const emptyField = await retrieveData('emptyField');
      setEmptyField(emptyField);
      if (userResponse?.package) {
        setUserPackage(userResponse.package); 
      }
    } catch (error) {
      console.error('Error fetching user subscription:', error);
    }
  };

  // Polling effect for user subscription
  useEffect(() => {
    if (!isReady || !loaded || userPackage) return;

    const intervalId = setInterval(async () => {
      await fetchUserSubscription();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isReady, loaded, userPackage]);

  useEffect(() => {
    const prepare = async () => {
      try {
        // Wait for fonts and initial auth check
        await SplashScreen.preventAutoHideAsync();
        await fetchUserSubscription();
        // console.log('Pathname', pathname)
        // console.log('user', userPackage)
      } catch (error) {
        console.error('Initial auth check failed:', error);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    };
    prepare();
  }, []);

  // Handle redirects after initial render
  useEffect(() => {
    if (!isReady || !loaded) return;

    const noTrack = NO_CHECK_TOKEN.some(
      route => pathname === route || pathname?.startsWith(route + '/')
    );

    const verifyAuth = async () => {
      try {
        const hasToken = await checkToken();
      
        if (noTrack && hasToken) {
          router.replace('/');
          return;
        }
      
        if (!hasToken && !noTrack) {
          router.replace('/sign-in');
          return;
        }
      
        if (hasToken && !userPackage && pathname !== '/subscription') {
          router.replace('/subscription');
          return;
        }
      
        // Allow staying on subscription page if payment is in progress
        if (hasToken && pathname === '/subscription') {
          return;
        }
      
      } catch (error) {
        console.error('Auth verification failed:', error);
      }
    };

    verifyAuth();
  }, [pathname, isReady, loaded, userPackage]);

  if (!loaded || !isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AutocompleteDropdownContextProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(root)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
      <Toaster />
    </AutocompleteDropdownContextProvider>
  );
}