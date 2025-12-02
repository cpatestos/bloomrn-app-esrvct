
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    console.log('✅ Welcome screen mounted and visible');
  }, []);

  const handleGetStarted = () => {
    console.log('🚀 Get Started button pressed - navigating to role selection');
    router.push('/onboarding/role-selection');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primaryLight, colors.secondaryLight]}
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
              Your wellness companion for nursing
            </Text>
            <Text style={styles.description}>
              Supporting student nurses and registered nurses with mindfulness, self-care, and reflection tools.
            </Text>

            <View style={styles.featureContainer}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🧘‍♀️</Text>
                <Text style={styles.featureText}>Mindfulness</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📝</Text>
                <Text style={styles.featureText}>Journaling</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📊</Text>
                <Text style={styles.featureText}>Tracking</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>💚</Text>
                <Text style={styles.featureText}>Self-Care</Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[buttonStyles.primary, styles.button]}
              onPress={handleGetStarted}
            >
              <Text style={[buttonStyles.text, { color: '#FFFFFF' }]}>Get Started</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 100,
    marginBottom: 24,
  },
  title: {
    fontSize: 56,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  featureContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  featureItem: {
    alignItems: 'center',
    width: 80,
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
  },
});
