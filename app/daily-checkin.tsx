
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { DailyCheckIn } from '@/types';
import { getRandomAffirmation } from '@/data/affirmations';
import { defaultSelfCareActivities } from '@/data/selfCareActivities';

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

      // Get suggestions and affirmation
      const affirmation = getRandomAffirmation(profile.role);
      const allActivities = defaultSelfCareActivities;
      const roleActivities = allActivities.filter(
        a => !a.roleTag || a.roleTag === profile.role
      );
      const suggestions = roleActivities
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      router.replace({
        pathname: '/checkin-complete',
        params: {
          affirmation,
          suggestions: JSON.stringify(suggestions.map(s => ({ title: s.title, duration: s.durationMinutes }))),
        },
      });
    } catch (error) {
      console.error('Error saving check-in:', error);
      Alert.alert('Error', 'Failed to save check-in');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderScale = (value: number, setValue: (v: number) => void, label: string) => (
    <View style={styles.scaleContainer}>
      <Text style={styles.scaleLabel}>{label}</Text>
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
      <View style={styles.header}>
        <Text style={commonStyles.title}>Daily Check-In</Text>
        <Text style={commonStyles.text}>
          Take a moment to reflect on how you&apos;re feeling today
        </Text>
      </View>

      <View style={styles.form}>
        {renderScale(mood, setMood, 'How is your mood? (1=Low, 5=Great)')}
        {renderScale(stress, setStress, 'Stress level? (1=Low, 5=High)')}
        {renderScale(energy, setEnergy, 'Energy level? (1=Low, 5=High)')}

        <Text style={styles.label}>Optional Note</Text>
        <TextInput
          style={[commonStyles.input, styles.textArea]}
          value={note}
          onChangeText={setNote}
          placeholder="Anything on your mind?"
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Gratitude (1-3 items)</Text>
        <TextInput
          style={commonStyles.input}
          value={gratitude1}
          onChangeText={setGratitude1}
          placeholder="Something you're grateful for"
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={commonStyles.input}
          value={gratitude2}
          onChangeText={setGratitude2}
          placeholder="Another thing (optional)"
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={commonStyles.input}
          value={gratitude3}
          onChangeText={setGratitude3}
          placeholder="One more (optional)"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <TouchableOpacity
        style={[buttonStyles.primary, styles.button]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={buttonStyles.text}>
          {isSubmitting ? 'Saving...' : 'Complete Check-In'}
        </Text>
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
  scaleContainer: {
    marginBottom: 24,
  },
  scaleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  scale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  scaleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  scaleButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  scaleButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  scaleButtonTextSelected: {
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    width: '100%',
  },
});
