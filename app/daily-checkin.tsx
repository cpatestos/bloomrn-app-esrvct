
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { DailyCheckIn } from '@/types';

export default function DailyCheckInScreen() {
  const router = useRouter();
  const [mood, setMood] = React.useState(3);
  const [stress, setStress] = React.useState(3);
  const [energy, setEnergy] = React.useState(3);
  const [note, setNote] = React.useState('');
  const [gratitude1, setGratitude1] = React.useState('');
  const [gratitude2, setGratitude2] = React.useState('');
  const [gratitude3, setGratitude3] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const profile = await storage.getUserProfile();
      if (!profile) {
        Alert.alert('Error', 'Profile not found');
        setIsSubmitting(false);
        return;
      }

      const gratitudeItems = [gratitude1, gratitude2, gratitude3].filter(g => g.trim());

      const checkIn: DailyCheckIn = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        mood,
        stress,
        energy,
        note: note.trim() || undefined,
        gratitude: gratitudeItems,
      };

      await storage.saveDailyCheckIn(checkIn);
      Alert.alert('Success', 'Check-in saved successfully!');
      router.back();
    } catch (error) {
      console.error('Error saving check-in:', error);
      Alert.alert('Error', 'Failed to save check-in');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderScale = (value: number, setValue: (v: number) => void, label: string, emoji: string) => (
    <View style={styles.scaleContainer}>
      <View style={styles.scaleHeader}>
        <Text style={styles.scaleEmoji}>{emoji}</Text>
        <Text style={styles.scaleLabel}>{label}</Text>
      </View>
      <View style={styles.scale}>
        {[1, 2, 3, 4, 5].map((num, index) => (
          <React.Fragment key={index}>
            <TouchableOpacity
              style={[
                styles.scaleButton,
                value === num && styles.scaleButtonSelected,
              ]}
              onPress={() => setValue(num)}
            >
              <Text
                style={[
                  styles.scaleButtonText,
                  value === num && styles.scaleButtonTextSelected,
                ]}
              >
                {num}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={commonStyles.title}>Daily Check-In</Text>
        <Text style={commonStyles.text}>
          Take a moment to reflect on how you&apos;re feeling today
        </Text>
      </View>

      <View style={styles.form}>
        {renderScale(mood, setMood, 'How is your mood?', '😊')}
        {renderScale(stress, setStress, 'Stress level?', '😰')}
        {renderScale(energy, setEnergy, 'Energy level?', '⚡')}

        <View style={styles.noteSection}>
          <Text style={styles.sectionTitle}>💭 Optional Note</Text>
          <TextInput
            style={[commonStyles.input, styles.textArea]}
            value={note}
            onChangeText={setNote}
            placeholder="Anything on your mind?"
            placeholderTextColor={colors.textLight}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.gratitudeSection}>
          <Text style={styles.sectionTitle}>🙏 Gratitude (1-3 items)</Text>
          <TextInput
            style={commonStyles.input}
            value={gratitude1}
            onChangeText={setGratitude1}
            placeholder="Something you're grateful for"
            placeholderTextColor={colors.textLight}
          />
          <TextInput
            style={commonStyles.input}
            value={gratitude2}
            onChangeText={setGratitude2}
            placeholder="Another thing (optional)"
            placeholderTextColor={colors.textLight}
          />
          <TextInput
            style={commonStyles.input}
            value={gratitude3}
            onChangeText={setGratitude3}
            placeholder="One more (optional)"
            placeholderTextColor={colors.textLight}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[buttonStyles.primary, styles.button]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={[buttonStyles.text, { color: '#FFFFFF' }]}>
          {isSubmitting ? 'Saving...' : 'Complete Check-In'}
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
  scaleContainer: {
    marginBottom: 32,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  scaleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scaleEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  scaleLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  scale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  scaleButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  scaleButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  scaleButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  scaleButtonTextSelected: {
    color: colors.primaryDark,
  },
  noteSection: {
    marginBottom: 24,
  },
  gratitudeSection: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    width: '100%',
  },
});
