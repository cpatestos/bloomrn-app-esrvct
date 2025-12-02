
import "react-native-reanimated";
import React, { useEffect, useState, useRef } from "react";
import { useFonts } from "expo-font";
import { Stack, router, useSegments, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme, View, Text } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { storage } from "@/utils/storage";
import { colors } from "@/styles/commonStyles";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.error("❌ ErrorBoundary caught error:", error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("❌ ErrorBoundary details:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: colors.background }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, color: colors.text }}>
            Something went wrong
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: "center" }}>
            {this.state.error?.message || "Unknown error"}
          </Text>
          <Text style={{ fontSize: 12, color: colors.textLight, marginTop: 20, textAlign: "center" }}>
            Check the console for more details
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

function RootLayoutNav() {
  console.log("🚀 RootLayoutNav rendering...");
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const pathname = usePathname();
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const hasInitialized = useRef(false);
  const isNavigating = useRef(false);

  console.log("📝 Font loaded:", loaded, "Font error:", error);

  // Initial onboarding check - only runs once
  useEffect(() => {
    if (!loaded || hasInitialized.current) {
      return;
    }

    console.log("🔍 Initial onboarding check...");
    hasInitialized.current = true;

    async function checkOnboarding() {
      try {
        console.log("📱 Fetching user profile...");
        const profile = await storage.getUserProfile();
        console.log("👤 User profile:", profile);
        
        const completed = profile?.hasCompletedOnboarding || false;
        setHasCompletedOnboarding(completed);
        
        if (!completed && !isNavigating.current) {
          console.log("➡️  User needs onboarding, navigating to welcome...");
          isNavigating.current = true;
          setTimeout(() => {
            router.replace('/onboarding/welcome');
            isNavigating.current = false;
          }, 100);
        } else {
          console.log("✅ User has completed onboarding");
        }
      } catch (error) {
        console.error('❌ Error checking onboarding:', error);
      } finally {
        setIsCheckingOnboarding(false);
        console.log("✅ Onboarding check complete");
        SplashScreen.hideAsync().catch(err => console.error("❌ Error hiding splash:", err));
      }
    }

    checkOnboarding();
  }, [loaded]);

  // Route protection - only redirects when necessary
  useEffect(() => {
    if (isCheckingOnboarding || !loaded || !hasInitialized.current || isNavigating.current) {
      return;
    }

    const inOnboarding = segments[0] === 'onboarding';
    const currentPath = pathname || '/';
    
    console.log("🔐 Route protection check:", { 
      hasCompletedOnboarding, 
      inOnboarding,
      currentPath,
      segments: segments.join('/')
    });

    // Only redirect if we're in the wrong place
    if (!hasCompletedOnboarding && !inOnboarding && currentPath !== '/onboarding/welcome') {
      console.log("➡️  Redirecting to onboarding (not completed)");
      isNavigating.current = true;
      router.replace('/onboarding/welcome');
      setTimeout(() => { isNavigating.current = false; }, 500);
    } else if (hasCompletedOnboarding && inOnboarding) {
      console.log("➡️  Redirecting to home (already completed)");
      isNavigating.current = true;
      router.replace('/(tabs)/(home)/');
      setTimeout(() => { isNavigating.current = false; }, 500);
    }
  }, [hasCompletedOnboarding, segments, pathname, isCheckingOnboarding, loaded]);

  if (error) {
    console.error("❌ Font loading error:", error);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <Text style={{ fontSize: 18, color: colors.text }}>Font loading error</Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 10 }}>{error.message}</Text>
      </View>
    );
  }

  if (!loaded || isCheckingOnboarding) {
    console.log("⏳ Waiting for fonts or onboarding check...", { loaded, isCheckingOnboarding });
    return null;
  }

  console.log("🎨 Rendering main app with theme:", colorScheme);

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.error,
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: colors.primary,
      background: colors.darkBackground,
      card: colors.darkCard,
      text: colors.darkText,
      border: colors.border,
      notification: colors.error,
    },
  };

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding/welcome" />
          <Stack.Screen name="onboarding/role-selection" />
          <Stack.Screen name="onboarding/profile" />
          <Stack.Screen name="onboarding/avatar-selection" />
          <Stack.Screen name="daily-checkin" />
          <Stack.Screen name="activity-detail" />
          <Stack.Screen name="time-management" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <SystemBars style={"auto"} />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  console.log("🎬 App starting - RootLayout component mounted");
  return (
    <ErrorBoundary>
      <StatusBar style="auto" animated />
      <RootLayoutNav />
    </ErrorBoundary>
  );
}
