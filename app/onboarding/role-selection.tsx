
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { UserRole } from '@/types';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = React.useState<UserRole | null>(null);

  const handleContinue = async () => {
    if (!selectedRole) return;

    try {
      const profile = await storage.getUserProfile();
      await storage.saveUserProfile({
        ...profile,
        role: selectedRole,
        firstName: profile?.firstName || '',
        priorities: profile?.priorities || [],
        hasCompletedOnboarding: false,
      });

      router.push('/onboarding/profile');
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>Choose Your Path</Text>
        <Text style={commonStyles.text}>
          Select your current role to personalize your experience
        </Text>
      </View>

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleCard,
            selectedRole === 'student' && styles.roleCardSelected,
          ]}
          onPress={() => setSelectedRole('student')}
        >
          <View style={styles.roleIconContainer}>
            <Text style={styles.roleIcon}>🎓</Text>
          </View>
          <Text style={styles.roleTitle}>Student Nurse</Text>
          <Text style={styles.roleDescription}>
            Tools for managing coursework, clinical rotations, and exam preparation
          </Text>
          {selectedRole === 'student' && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleCard,
            selectedRole === 'rn' && styles.roleCardSelected,
          ]}
          onPress={() => setSelectedRole('rn')}
        >
          <View style={styles.roleIconContainer}>
            <Text style={styles.roleIcon}>⚕️</Text>
          </View>
          <Text style={styles.roleTitle}>Registered Nurse</Text>
          <Text style={styles.roleDescription}>
            Support for shift work, professional boundaries, and self-care
          </Text>
          {selectedRole === 'rn' && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          buttonStyles.primary,
          styles.button,
          !selectedRole && styles.buttonDisabled,
        ]}
        onPress={handleContinue}
        disabled={!selectedRole}
      >
        <Text style={[buttonStyles.text, { color: '#FFFFFF' }]}>Continue</Text>
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
  roleContainer: {
    marginBottom: 40,
    gap: 20,
  },
  roleCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    position: 'relative',
  },
  roleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  roleIconContainer: {
    marginBottom: 16,
  },
  roleIcon: {
    fontSize: 60,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  roleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  button: {
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
