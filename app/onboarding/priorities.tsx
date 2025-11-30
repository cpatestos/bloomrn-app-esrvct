
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { Priority, UserRole } from '@/types';
import { storage } from '@/utils/storage';

export default function PrioritiesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const role = params.role as UserRole;

  const sharedPriorities: Priority[] = ['stress', 'routines', 'sleep', 'boundaries'];
  const studentPriorities: Priority[] = [...sharedPriorities, 'exam prep'];
  const rnPriorities: Priority[] = [...sharedPriorities, 'shift recovery'];

  const availablePriorities = role === 'student' ? studentPriorities : rnPriorities;

  const [selectedPriorities, setSelectedPriorities] = React.useState<Priority[]>([]);

  const togglePriority = (priority: Priority) => {
    if (selectedPriorities.includes(priority)) {
      setSelectedPriorities(selectedPriorities.filter(p => p !== priority));
    } else {
      setSelectedPriorities([...selectedPriorities, priority]);
    }
  };

  const handleContinue = async () => {
    const profile = {
      firstName: params.firstName as string,
      role,
      priorities: selectedPriorities,
      hasCompletedOnboarding: true,
      ...(role === 'student' && {
        studentProfile: {
          programType: params.programType as any,
          semester: params.semester as string,
          year: params.year as string,
        },
      }),
      ...(role === 'rn' && {
        rnProfile: {
          yearsExperience: params.yearsExperience as string,
          setting: params.setting as any,
        },
      }),
    };

    await storage.saveUserProfile(profile);
    router.replace('/daily-checkin');
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>What Matters Most?</Text>
        <Text style={commonStyles.text}>
          Select the areas you&apos;d like to focus on. You can change these anytime.
        </Text>
      </View>

      <View style={styles.prioritiesContainer}>
        {availablePriorities.map((priority, index) => (
          <React.Fragment key={index}>
            <TouchableOpacity
              style={[
                styles.priorityCard,
                selectedPriorities.includes(priority) && styles.priorityCardSelected,
              ]}
              onPress={() => togglePriority(priority)}
            >
              <Text style={styles.priorityText}>{priority}</Text>
              {selectedPriorities.includes(priority) && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </View>

      <TouchableOpacity
        style={[
          buttonStyles.primary,
          styles.button,
          selectedPriorities.length === 0 && styles.buttonDisabled,
        ]}
        onPress={handleContinue}
        disabled={selectedPriorities.length === 0}
      >
        <Text style={buttonStyles.text}>Complete Setup</Text>
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
  prioritiesContainer: {
    gap: 12,
    marginBottom: 32,
  },
  priorityCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  priorityCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  priorityText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    textTransform: 'capitalize',
  },
  checkmark: {
    fontSize: 20,
    color: colors.text,
  },
  button: {
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
