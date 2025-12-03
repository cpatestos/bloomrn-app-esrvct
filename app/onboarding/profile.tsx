
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { UserProfile } from '@/types';
import BotanicalBackground from '@/components/BotanicalBackground';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [programType, setProgramType] = useState<'ADN' | 'BSN' | 'MSN/DNP/PHD' | ''>('');
  const [semester, setSemester] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [setting, setSetting] = useState<'Hospital' | 'Clinic' | 'Community' | ''>('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const savedProfile = await storage.getUserProfile();
    setProfile(savedProfile);
  };

  const handleContinue = async () => {
    if (!firstName.trim() || !profile) return;

    const updatedProfile: UserProfile = {
      ...profile,
      firstName: firstName.trim(),
      hasCompletedOnboarding: false, // Will be set to true after avatar selection
    };

    if (profile.role === 'student') {
      updatedProfile.programType = programType || undefined;
      updatedProfile.semester = semester || undefined;
    } else {
      updatedProfile.yearsExperience = yearsExperience || undefined;
      updatedProfile.setting = setting || undefined;
    }

    await storage.saveUserProfile(updatedProfile);
    console.log('✅ Profile saved, navigating to avatar selection...');
    router.push('/onboarding/avatar-selection');
  };

  const bgColor = isDark ? colors.darkBackground : colors.background;
  const textColor = isDark ? colors.darkText : colors.text;
  const cardColor = isDark ? colors.darkCard : colors.card;
  const inputBg = isDark ? colors.darkCard : colors.card;

  return (
    <View style={[commonStyles.container, { backgroundColor: bgColor }]}>
      <BotanicalBackground />
      <ScrollView contentContainerStyle={[commonStyles.content, styles.content]}>
        <Text style={[commonStyles.title, { color: textColor }]}>Tell Us About Yourself</Text>
        <Text style={[commonStyles.textSecondary, styles.subtitle, { color: isDark ? colors.darkTextSecondary : colors.textSecondary }]}>
          Help Us Personalize Your Experience
        </Text>

        <View style={styles.form}>
          <Text style={[styles.label, { color: textColor }]}>First Name *</Text>
          <TextInput
            style={[commonStyles.input, { backgroundColor: inputBg, color: textColor }]}
            placeholder="Enter your first name"
            placeholderTextColor={isDark ? colors.darkTextSecondary : colors.textLight}
            value={firstName}
            onChangeText={setFirstName}
          />

          {profile?.role === 'student' && (
            <>
              <Text style={[styles.label, { color: textColor }]}>Program Type</Text>
              <View style={styles.optionGroup}>
                {['BSN', 'ADN', 'Accelerated'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.option,
                      { backgroundColor: cardColor },
                      programType === type && styles.optionSelected,
                    ]}
                    onPress={() => setProgramType(type as any)}
                  >
                    <Text style={[styles.optionText, { color: textColor }]}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: textColor }]}>Current Semester/Year</Text>
              <TextInput
                style={[commonStyles.input, { backgroundColor: inputBg, color: textColor }]}
                placeholder="e.g., Semester 3, Year 2"
                placeholderTextColor={isDark ? colors.darkTextSecondary : colors.textLight}
                value={semester}
                onChangeText={setSemester}
              />
            </>
          )}

          {profile?.role === 'rn' && (
            <>
              <Text style={[styles.label, { color: textColor }]}>Years Of Experience</Text>
              <TextInput
                style={[commonStyles.input, { backgroundColor: inputBg, color: textColor }]}
                placeholder="e.g., 5 years"
                placeholderTextColor={isDark ? colors.darkTextSecondary : colors.textLight}
                value={yearsExperience}
                onChangeText={setYearsExperience}
                keyboardType="numeric"
              />

              <Text style={[styles.label, { color: textColor }]}>Work Setting</Text>
              <View style={styles.optionGroup}>
                {['Hospital', 'Clinic', 'Community'].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.option,
                      { backgroundColor: cardColor },
                      setting === s && styles.optionSelected,
                    ]}
                    onPress={() => setSetting(s as any)}
                  >
                    <Text style={[styles.optionText, { color: textColor }]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <TouchableOpacity
            style={[
              buttonStyles.primary,
              styles.button,
              !firstName.trim() && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!firstName.trim()}
          >
            <Text style={buttonStyles.textLight}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 80,
  },
  subtitle: {
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  optionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    marginTop: 32,
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
