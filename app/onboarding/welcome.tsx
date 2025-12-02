
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';
import BotanicalBackground from '@/components/BotanicalBackground';

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleGetStarted = () => {
    console.log('🚀 Navigating to role selection...');
    router.push('/onboarding/role-selection');
  };

  const bgColor = isDark ? colors.darkBackground : colors.background;
  const textColor = isDark ? colors.darkText : colors.text;

  return (
    <View style={[commonStyles.container, { backgroundColor: bgColor }]}>
      <BotanicalBackground />
      <LinearGradient
        colors={isDark ? [colors.primaryDark, bgColor] : [colors.primaryLight, colors.secondaryLight]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.logo}>🌸</Text>
          <Text style={[styles.title, { color: textColor }]}>Welcome To BloomRN</Text>
          <Text style={[styles.subtitle, { color: isDark ? colors.darkTextSecondary : colors.textSecondary }]}>
            Your Companion For Growth, Balance, And Well-Being
          </Text>
          
          <View style={styles.features}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✨</Text>
              <Text style={[styles.featureText, { color: textColor }]}>Daily Check-Ins</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🧘‍♀️</Text>
              <Text style={[styles.featureText, { color: textColor }]}>Wellness Activities</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📝</Text>
              <Text style={[styles.featureText, { color: textColor }]}>Journaling</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>⏰</Text>
              <Text style={[styles.featureText, { color: textColor }]}>Time Management</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[buttonStyles.primary, styles.button]}
            onPress={handleGetStarted}
          >
            <Text style={buttonStyles.textLight}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    width: '100%',
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  features: {
    width: '100%',
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  featureText: {
    fontSize: 18,
    fontWeight: '500',
  },
  button: {
    width: '100%',
    maxWidth: 300,
  },
});
