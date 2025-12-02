
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { DailyCheckIn } from '@/types';
import BotanicalBackground from '@/components/BotanicalBackground';

export default function DailyCheckInScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [mood, setMood] = useState(3);
  const [stress, setStress] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [note, setNote] = useState('');
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');

  const handleSubmit = async () => {
    const gratitudeList = [gratitude1, gratitude2, gratitude3].filter(g => g.trim());

    const checkIn: DailyCheckIn = {
      date: new Date().toISOString().split('T')[0],
      mood,
      stress,
      energy,
      note: note.trim() || undefined,
      gratitude: gratitudeList,
    };

    await storage.saveDailyCheckIn(checkIn);
    Alert.alert('Success', 'Daily check-in saved!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const renderScale = (value: number, setValue: (v: number) => void, label: string) => {
    const bgColor = isDark ? colors.darkBackground : colors.background;
    const textColor = isDark ? colors.darkText : colors.text;
    const cardColor = isDark ? colors.darkCard : colors.card;

    return (
      <View style={styles.scaleSection}>
        <Text style={[styles.scaleLabel, { color: textColor }]}>{label}</Text>
        <View style={styles.scaleButtons}>
          {[1, 2, 3, 4, 5].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.scaleButton,
                { backgroundColor: cardColor },
                value === num && styles.scaleButtonSelected,
              ]}
              onPress={() => setValue(num)}
            >
              <Text
                style={[
                  styles.scaleButtonText,
                  { color: textColor },
                  value === num && styles.scaleButtonTextSelected,
                ]}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const bgColor = isDark ? colors.darkBackground : colors.background;
  const textColor = isDark ? colors.darkText : colors.text;
  const inputBg = isDark ? colors.darkCard : colors.card;

  return (
    <View style={[commonStyles.container, { backgroundColor: bgColor }]}>
      <BotanicalBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[commonStyles.title, { color: textColor }]}>Daily Check-In</Text>
          <Text style={[commonStyles.textSecondary, { color: isDark ? colors.darkTextSecondary : colors.textSecondary }]}>
            Take A Moment To Reflect On Your Day
          </Text>
        </View>

        {renderScale(mood, setMood, 'How Is Your Mood? (1 = Low, 5 = Great)')}
        {renderScale(stress, setStress, 'Stress Level? (1 = Low, 5 = High)')}
        {renderScale(energy, setEnergy, 'Energy Level? (1 = Low, 5 = High)')}

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: textColor }]}>Optional Note</Text>
          <TextInput
            style={[commonStyles.input, styles.noteInput, { backgroundColor: inputBg, color: textColor }]}
            placeholder="How are you feeling today?"
            placeholderTextColor={isDark ? colors.darkTextSecondary : colors.textLight}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: textColor }]}>Three Things I&apos;m Grateful For</Text>
          <TextInput
            style={[commonStyles.input, { backgroundColor: inputBg, color: textColor }]}
            placeholder="1. Something you're grateful for"
            placeholderTextColor={isDark ? colors.darkTextSecondary : colors.textLight}
            value={gratitude1}
            onChangeText={setGratitude1}
          />
          <TextInput
            style={[commonStyles.input, { backgroundColor: inputBg, color: textColor }]}
            placeholder="2. Something you're grateful for"
            placeholderTextColor={isDark ? colors.darkTextSecondary : colors.textLight}
            value={gratitude2}
            onChangeText={setGratitude2}
          />
          <TextInput
            style={[commonStyles.input, { backgroundColor: inputBg, color: textColor }]}
            placeholder="3. Something you're grateful for"
            placeholderTextColor={isDark ? colors.darkTextSecondary : colors.textLight}
            value={gratitude3}
            onChangeText={setGratitude3}
          />
        </View>

        <TouchableOpacity
          style={[buttonStyles.primary, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Text style={buttonStyles.textLight}>Complete Check-In</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scaleSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  scaleLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  scaleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  scaleButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  scaleButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  scaleButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  scaleButtonTextSelected: {
    color: colors.primaryDark,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  noteInput: {
    height: 100,
    paddingTop: 14,
  },
  submitButton: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
});
