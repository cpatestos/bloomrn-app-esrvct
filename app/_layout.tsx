
import "react-native-reanimated";
import React, { useEffect, useState, useRef } from "react";
import { useFonts } from "expo-font";
import { Stack, router, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme, Alert, View, Text } from "react-native";
import { useNetworkState } from "expo-network";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { storage } from "@/utils/storage";
import { AuthProvider } from "@/contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Error Boundary Component
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
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#000" }}>
            Something went wrong
          </Text>
          <Text style={{ fontSize: 14, color: "#666", textAlign: "center" }}>
            {this.state.error?.message || "Unknown error"}
          </Text>
          <Text style={{ fontSize: 12, color: "#999", marginTop: 20, textAlign: "center" }}>
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
  const networkState = useNetworkState();
  const segments = useSegments();
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const hasCheckedOnboarding = useRef(false);

  console.log("📝 Font loaded:", loaded, "Font error:", error);

  useEffect(() => {
    // Only check onboarding once when fonts are loaded
    if (!loaded || hasCheckedOnboarding.current) {
      return;
    }

    console.log("🔍 useEffect: checking onboarding...");
    hasCheckedOnboarding.current = true;

    async function checkOnboarding() {
      try {
        console.log("📱 Fetching user profile...");
        const profile = await storage.getUserProfile();
        console.log("👤 User profile:", profile);
        
        const completed = profile?.hasCompletedOnboarding || false;
        setHasCompletedOnboarding(completed);
        
        if (!completed) {
          console.log("➡️  Redirecting to onboarding welcome screen...");
          router.replace('/onboarding/welcome');
        } else {
          console.log("✅ User has completed onboarding");
        }
      } catch (error) {
        console.error('❌ Error checking onboarding:', error);
      } finally {
        setIsCheckingOnboarding(false);
        console.log("✅ Onboarding check complete");
      }
    }

    console.log("🎨 Fonts loaded, checking onboarding and hiding splash...");
    checkOnboarding();
    SplashScreen.hideAsync().catch(err => console.error("❌ Error hiding splash:", err));
  }, [loaded]);

  // Protect routes based on onboarding status
  useEffect(() => {
    if (isCheckingOnboarding || !loaded) {
      return;
    }

    const inOnboarding = segments[0] === 'onboarding';
    const inAuth = segments[0] === 'auth';
    
    console.log("🔐 Route protection check:", { 
      hasCompletedOnboarding, 
      inOnboarding,
      inAuth,
      currentRoute: segments.join('/') || 'root'
    });

    // If user hasn't completed onboarding and not in onboarding/auth flow, redirect
    if (!hasCompletedOnboarding && !inOnboarding && !inAuth) {
      console.log("➡️  Redirecting to onboarding from route protection");
      router.replace('/onboarding/welcome');
    }
    // If user has completed onboarding and is in onboarding flow, redirect to home
    else if (hasCompletedOnboarding && inOnboarding) {
      console.log("➡️  Redirecting to home from route protection");
      router.replace('/(tabs)/(home)/');
    }
  }, [hasCompletedOnboarding, segments, isCheckingOnboarding, loaded]);

  React.useEffect(() => {
    console.log("🌐 Network state:", networkState);
    if (
      !networkState.isConnected &&
      networkState.isInternetReachable === false
    ) {
      Alert.alert(
        "🔌 You are offline",
        "You can keep using the app! Your changes will be saved locally and synced when you are back online."
      );
    }
  }, [networkState.isConnected, networkState.isInternetReachable]);

  if (error) {
    console.error("❌ Font loading error:", error);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <Text style={{ fontSize: 18, color: "#000" }}>Font loading error</Text>
        <Text style={{ fontSize: 14, color: "#666", marginTop: 10 }}>{error.message}</Text>
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
      primary: "rgb(0, 122, 255)",
      background: "rgb(242, 242, 247)",
      card: "rgb(255, 255, 255)",
      text: "rgb(0, 0, 0)",
      border: "rgb(216, 216, 220)",
      notification: "rgb(255, 59, 48)",
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "rgb(10, 132, 255)",
      background: "rgb(1, 1, 1)",
      card: "rgb(28, 28, 30)",
      text: "rgb(255, 255, 255)",
      border: "rgb(44, 44, 46)",
      notification: "rgb(255, 69, 58)",
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
          <Stack.Screen name="onboarding/priorities" />
          <Stack.Screen name="auth/sign-in" />
          <Stack.Screen name="auth/sign-up" />
          <Stack.Screen name="daily-checkin" />
          <Stack.Screen name="checkin-complete" />
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
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ErrorBoundary>
  );
}
