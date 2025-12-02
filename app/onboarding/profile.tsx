
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';

export default function ProfileScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleContinue = async () => {
    if (!firstName.trim()) {
      Alert.alert('Required', 'Please enter your first name');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const profile = await storage.getUserProfile();
      await storage.saveUserProfile({
        ...profile,
        firstName: firstName.trim(),
        role: profile?.role || 'student',
        priorities: profile?.priorities || [],
        hasCompletedOnboarding: true,
      });

      router.replace('/(tabs)/(home)/');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>Welcome!</Text>
        <Text style={commonStyles.text}>
          Let&apos;s personalize your experience
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>What should we call you?</Text>
        <TextInput
          style={commonStyles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter your first name"
          placeholderTextColor={colors.textLight}
          autoCapitalize="words"
          autoFocus
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            We&apos;ll use this to personalize your experience and make the app feel more welcoming.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[buttonStyles.primary, styles.button]}
        onPress={handleContinue}
        disabled={isSubmitting || !firstName.trim()}
      >
        <Text style={[buttonStyles.text, { color: '#FFFFFF' }]}>
          {isSubmitting ? 'Setting up...' : 'Get Started'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  form: {
    marginBottom: 40,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  button: {
    width: '100%',
  },
});
