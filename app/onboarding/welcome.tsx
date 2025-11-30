
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.gradient}
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
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[buttonStyles.primary, styles.button]}
            onPress={() => router.push('/onboarding/role-selection')}
          >
            <Text style={buttonStyles.text}>Get Started</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    paddingTop: 100,
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
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
});
