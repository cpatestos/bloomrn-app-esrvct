
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import BotanicalBackground from '@/components/BotanicalBackground';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedRole, setSelectedRole] = useState<'student' | 'rn' | null>(null);

  const handleContinue = async () => {
    if (!selectedRole) return;

    console.log('📝 Selected role:', selectedRole);
    
    // Save role temporarily
    await storage.saveUserProfile({
      firstName: '',
      role: selectedRole,
      hasCompletedOnboarding: false,
    });

    router.push('/onboarding/profile');
  };

  const bgColor = isDark ? colors.darkBackground : colors.background;
  const textColor = isDark ? colors.darkText : colors.text;
  const cardColor = isDark ? colors.darkCard : colors.card;

  return (
    <View style={[commonStyles.container, { backgroundColor: bgColor }]}>
      <BotanicalBackground />
      <View style={[commonStyles.content, styles.content]}>
        <Text style={[commonStyles.title, { color: textColor }]}>Choose Your Path</Text>
        <Text style={[commonStyles.textSecondary, styles.subtitle, { color: isDark ? colors.darkTextSecondary : colors.textSecondary }]}>
          Select Your Current Role To Personalize Your Experience
        </Text>

        <TouchableOpacity
          style={[
            styles.roleCard,
            { backgroundColor: cardColor },
            selectedRole === 'student' && styles.roleCardSelected,
          ]}
          onPress={() => setSelectedRole('student')}
        >
          <Text style={styles.roleIcon}>🎓</Text>
          <Text style={[styles.roleTitle, { color: textColor }]}>Student Nurse</Text>
          <Text style={[styles.roleDescription, { color: isDark ? colors.darkTextSecondary : colors.textSecondary }]}>
            Wellness, Organization, And Self-Care For Student Nurses
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleCard,
            { backgroundColor: cardColor },
            selectedRole === 'rn' && styles.roleCardSelected,
          ]}
          onPress={() => setSelectedRole('rn')}
        >
          <Text style={styles.roleIcon}>⚕️</Text>
          <Text style={[styles.roleTitle, { color: textColor }]}>Registered Nurse</Text>
          <Text style={[styles.roleDescription, { color: isDark ? colors.darkTextSecondary : colors.textSecondary }]}>
            Shift Management, Boundaries, And Professional Well-Being
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            buttonStyles.primary,
            styles.button,
            !selectedRole && styles.buttonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedRole}
        >
          <Text style={buttonStyles.textLight}>Continue</Text>
        </TouchableOpacity>
      </View>
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
  roleCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  roleCardSelected: {
    borderColor: colors.primary,
    boxShadow: '0px 4px 16px rgba(79, 195, 247, 0.3)',
    elevation: 5,
  },
  roleIcon: {
    fontSize: 60,
    marginBottom: 12,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: 24,
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
