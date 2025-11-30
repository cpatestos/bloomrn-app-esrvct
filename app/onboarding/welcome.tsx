
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log('✅ WelcomeScreen mounted and rendering!');
    setIsLoaded(true);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.logo}>🌸</Text>
            <Text style={styles.title}>BloomRN</Text>
            <Text style={styles.subtitle}>
              Your companion for nursing school and professional practice
            </Text>
            <Text style={styles.description}>
              Supporting student nurses and registered nurses with tools for well-being, reflection, and growth.
            </Text>

            {isLoaded && (
              <View style={styles.statusContainer}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusEmoji}>✅</Text>
                  <Text style={styles.statusText}>App is running!</Text>
                </View>
                <Text style={styles.statusSubtext}>
                  If you can see this screen, your app is working correctly.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[buttonStyles.primary, styles.button]}
              onPress={() => {
                console.log('Get Started button pressed - navigating to role selection');
                router.push('/onboarding/role-selection');
              }}
            >
              <Text style={buttonStyles.text}>Get Started</Text>
            </TouchableOpacity>

            <Text style={styles.helpText}>
              👆 Tap the button above to continue
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  statusContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  statusSubtext: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    marginBottom: 16,
  },
  helpText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    opacity: 0.8,
  },
});
