
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { UserRole } from '@/types';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = React.useState<UserRole | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      router.push({
        pathname: '/onboarding/profile',
        params: { role: selectedRole },
      });
    }
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>Choose Your Role</Text>
        <Text style={commonStyles.text}>
          Select the role that best describes you. You can change this later in Settings.
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
          <Text style={styles.roleIcon}>📚</Text>
          <Text style={styles.roleTitle}>Student Nurse</Text>
          <Text style={styles.roleDescription}>
            Currently enrolled in a nursing program (BSN, ADN, or Accelerated)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleCard,
            selectedRole === 'rn' && styles.roleCardSelected,
          ]}
          onPress={() => setSelectedRole('rn')}
        >
          <Text style={styles.roleIcon}>🩺</Text>
          <Text style={styles.roleTitle}>Registered Nurse</Text>
          <Text style={styles.roleDescription}>
            Licensed RN working in clinical practice
          </Text>
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
        <Text style={buttonStyles.text}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  roleContainer: {
    gap: 16,
    marginBottom: 32,
  },
  roleCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  roleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  roleIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
