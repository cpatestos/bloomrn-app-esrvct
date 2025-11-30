
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { Shift } from '@/types';

export default function LogShiftScreen() {
  const router = useRouter();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [type, setType] = useState<'Day' | 'Evening' | 'Night'>('Day');
  const [proudOf, setProudOf] = useState('');
  const [releasing, setReleasing] = useState('');
  const [meaningfulMoment, setMeaningfulMoment] = useState('');

  const handleSave = async () => {
    if (!startTime || !endTime) {
      Alert.alert('Missing Information', 'Please enter start and end times');
      return;
    }

    const shift: Shift = {
      id: Date.now().toString(),
      date,
      startTime,
      endTime,
      type,
      proudOf: proudOf.trim() || undefined,
      releasing: releasing.trim() || undefined,
      meaningfulMoment: meaningfulMoment.trim() || undefined,
    };

    await storage.saveShift(shift);
    Alert.alert('Success', 'Shift logged successfully', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={commonStyles.title}>Log Shift</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={commonStyles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.label}>Shift Type</Text>
        <View style={styles.optionGroup}>
          {(['Day', 'Evening', 'Night'] as const).map((t, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                style={[styles.option, type === t && styles.optionSelected]}
                onPress={() => setType(t)}
              >
                <Text style={[styles.optionText, type === t && styles.optionTextSelected]}>
                  {t}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>

        <Text style={styles.label}>Start Time</Text>
        <TextInput
          style={commonStyles.input}
          value={startTime}
          onChangeText={setStartTime}
          placeholder="e.g., 7:00 AM"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.label}>End Time</Text>
        <TextInput
          style={commonStyles.input}
          value={endTime}
          onChangeText={setEndTime}
          placeholder="e.g., 7:00 PM"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.sectionTitle}>Shift Reflection</Text>

        <Text style={styles.label}>One thing I&apos;m proud of</Text>
        <TextInput
          style={[commonStyles.input, styles.textArea]}
          value={proudOf}
          onChangeText={setProudOf}
          placeholder="What went well today?"
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>One thing I&apos;m releasing</Text>
        <TextInput
          style={[commonStyles.input, styles.textArea]}
          value={releasing}
          onChangeText={setReleasing}
          placeholder="What are you letting go of?"
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Meaningful moment</Text>
        <TextInput
          style={[commonStyles.input, styles.textArea]}
          value={meaningfulMoment}
          onChangeText={setMeaningfulMoment}
          placeholder="A moment that mattered"
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity style={[buttonStyles.primary, styles.button]} onPress={handleSave}>
        <Text style={buttonStyles.text}>Save Shift</Text>
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
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
  },
  header: {
    marginBottom: 24,
  },
  form: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    width: '100%',
  },
});
