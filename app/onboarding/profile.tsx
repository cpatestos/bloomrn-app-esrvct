
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { UserRole, ProgramType, RNSetting } from '@/types';

export default function ProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const role = params.role as UserRole;

  const [firstName, setFirstName] = React.useState('');
  
  // Student fields
  const [programType, setProgramType] = React.useState<ProgramType>('BSN');
  const [semester, setSemester] = React.useState('');
  const [year, setYear] = React.useState('');
  
  // RN fields
  const [yearsExperience, setYearsExperience] = React.useState('');
  const [setting, setSetting] = React.useState<RNSetting>('Hospital');

  const handleContinue = () => {
    const profileData = {
      firstName,
      role,
      ...(role === 'student' && { programType, semester, year }),
      ...(role === 'rn' && { yearsExperience, setting }),
    };

    router.push({
      pathname: '/onboarding/priorities',
      params: { ...profileData },
    });
  };

  const isValid = () => {
    if (!firstName.trim()) return false;
    if (role === 'student') {
      return semester.trim() && year.trim();
    }
    if (role === 'rn') {
      return yearsExperience.trim();
    }
    return false;
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>Tell Us About You</Text>
        <Text style={commonStyles.text}>
          Help us personalize your experience
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={commonStyles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter your first name"
          placeholderTextColor={colors.textSecondary}
        />

        {role === 'student' && (
          <>
            <Text style={styles.label}>Program Type</Text>
            <View style={styles.optionGroup}>
              {(['BSN', 'ADN', 'Accelerated'] as ProgramType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.option,
                    programType === type && styles.optionSelected,
                  ]}
                  onPress={() => setProgramType(type)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      programType === type && styles.optionTextSelected,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Current Semester</Text>
            <TextInput
              style={commonStyles.input}
              value={semester}
              onChangeText={setSemester}
              placeholder="e.g., Fall, Spring, 3rd"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={styles.label}>Year</Text>
            <TextInput
              style={commonStyles.input}
              value={year}
              onChangeText={setYear}
              placeholder="e.g., 2024, 2nd year"
              placeholderTextColor={colors.textSecondary}
            />
          </>
        )}

        {role === 'rn' && (
          <>
            <Text style={styles.label}>Years of Experience</Text>
            <TextInput
              style={commonStyles.input}
              value={yearsExperience}
              onChangeText={setYearsExperience}
              placeholder="e.g., 2, 5, 10+"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Primary Setting</Text>
            <View style={styles.optionGroup}>
              {(['Hospital', 'Clinic', 'Community'] as RNSetting[]).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.option,
                    setting === s && styles.optionSelected,
                  ]}
                  onPress={() => setSetting(s)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      setting === s && styles.optionTextSelected,
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>

      <TouchableOpacity
        style={[
          buttonStyles.primary,
          styles.button,
          !isValid() && styles.buttonDisabled,
        ]}
        onPress={handleContinue}
        disabled={!isValid()}
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
  form: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 8,
  },
  optionGroup: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  optionText: {
    fontSize: 14,
    color: colors.text,
  },
  optionTextSelected: {
    fontWeight: '600',
  },
  button: {
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
