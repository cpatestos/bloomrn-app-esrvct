
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { Shift } from '@/types';

export default function LogShiftScreen() {
  const router = useRouter();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [shiftType, setShiftType] = useState<'Day' | 'Evening' | 'Night'>('Day');
  const [proudOf, setProudOf] = useState('');
  const [releasing, setReleasing] = useState('');
  const [meaningfulMoment, setMeaningfulMoment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!startTime || !endTime) {
      Alert.alert('Required', 'Please enter shift start and end times');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const shift: Shift = {
        id: Date.now().toString(),
        date,
        startTime,
        endTime,
        type: shiftType,
        proudOf: proudOf.trim() || undefined,
        releasing: releasing.trim() || undefined,
        meaningfulMoment: meaningfulMoment.trim() || undefined,
      };

      await storage.saveShift(shift);
      Alert.alert('Success', 'Shift logged successfully!');
      router.back();
    } catch (error) {
      console.error('Error saving shift:', error);
      Alert.alert('Error', 'Failed to save shift');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={commonStyles.title}>Log Shift</Text>
        <Text style={commonStyles.text}>
          Record and reflect on your shift
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.section}>
          <Text style={styles.label}>Shift Type</Text>
          <View style={styles.typeButtons}>
            {(['Day', 'Evening', 'Night'] as const).map((type, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    shiftType === type && styles.typeButtonSelected,
                  ]}
                  onPress={() => setShiftType(type)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      shiftType === type && styles.typeButtonTextSelected,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Start Time</Text>
          <TextInput
            style={commonStyles.input}
            value={startTime}
            onChangeText={setStartTime}
            placeholder="e.g., 7:00 AM"
            placeholderTextColor={colors.textLight}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>End Time</Text>
          <TextInput
            style={commonStyles.input}
            value={endTime}
            onChangeText={setEndTime}
            placeholder="e.g., 7:00 PM"
            placeholderTextColor={colors.textLight}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.reflectionTitle}>💪 One thing I&apos;m proud of</Text>
          <TextInput
            style={[commonStyles.input, styles.textArea]}
            value={proudOf}
            onChangeText={setProudOf}
            placeholder="What went well today?"
            placeholderTextColor={colors.textLight}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.reflectionTitle}>🌊 One thing I&apos;m releasing</Text>
          <TextInput
            style={[commonStyles.input, styles.textArea]}
            value={releasing}
            onChangeText={setReleasing}
            placeholder="What are you letting go of?"
            placeholderTextColor={colors.textLight}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.reflectionTitle}>✨ Meaningful moment</Text>
          <TextInput
            style={[commonStyles.input, styles.textArea]}
            value={meaningfulMoment}
            onChangeText={setMeaningfulMoment}
            placeholder="A moment that stood out"
            placeholderTextColor={colors.textLight}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[buttonStyles.primary, styles.button]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={[buttonStyles.text, { color: '#FFFFFF' }]}>
          {isSubmitting ? 'Saving...' : 'Save Shift'}
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
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  header: {
    marginBottom: 32,
  },
  form: {
    marginBottom: 32,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  typeButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  typeButtonTextSelected: {
    color: colors.primaryDark,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 24,
  },
  reflectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    width: '100%',
  },
});
