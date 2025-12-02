
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import BotanicalBackground from '@/components/BotanicalBackground';

const ACTIVITIES = [
  {
    id: '1',
    title: 'Deep Breathing',
    description: 'Practice deep breathing exercises to calm your mind and reduce stress. Breathe in slowly through your nose for 4 counts, hold for 4 counts, and exhale through your mouth for 6 counts. Repeat this cycle for 5 minutes.',
    durationMinutes: 5,
    category: 'Breathing',
    icon: '🫁',
  },
  {
    id: '2',
    title: 'Body Scan Meditation',
    description: 'Lie down or sit comfortably. Close your eyes and bring attention to each part of your body, starting from your toes and moving up to your head. Notice any tension and consciously relax each area.',
    durationMinutes: 10,
    category: 'Mind',
    icon: '🧘‍♀️',
  },
  {
    id: '3',
    title: 'Gentle Stretching',
    description: 'Perform gentle stretches to release physical tension. Focus on your neck, shoulders, back, and legs. Hold each stretch for 20-30 seconds and breathe deeply.',
    durationMinutes: 10,
    category: 'Body',
    icon: '🤸‍♀️',
  },
  {
    id: '4',
    title: 'Gratitude Practice',
    description: 'Take a moment to reflect on three things you&apos;re grateful for today. Write them down or simply think about them. Focus on the positive aspects of your life.',
    durationMinutes: 5,
    category: 'Heart',
    icon: '💚',
  },
];

export default function ActivityDetailScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { id } = useLocalSearchParams();
  
  const activity = ACTIVITIES.find(a => a.id === id);

  if (!activity) {
    return (
      <View style={[commonStyles.container, { backgroundColor: isDark ? colors.darkBackground : colors.background }]}>
        <Text style={[commonStyles.text, { color: isDark ? colors.darkText : colors.text }]}>Activity not found</Text>
      </View>
    );
  }

  const bgColor = isDark ? colors.darkBackground : colors.background;
  const textColor = isDark ? colors.darkText : colors.text;
  const cardColor = isDark ? colors.darkCard : colors.card;

  return (
    <View style={[commonStyles.container, { backgroundColor: bgColor }]}>
      <BotanicalBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>

        <View style={[styles.header, { backgroundColor: cardColor }]}>
          <Text style={styles.icon}>{activity.icon}</Text>
          <Text style={[styles.title, { color: textColor }]}>{activity.title}</Text>
          <Text style={[styles.meta, { color: isDark ? colors.darkTextSecondary : colors.textSecondary }]}>
            {activity.durationMinutes} minutes • {activity.category}
          </Text>
        </View>

        <View style={[commonStyles.card, { backgroundColor: cardColor }]}>
          <Text style={[commonStyles.heading, { color: textColor }]}>Instructions</Text>
          <Text style={[commonStyles.text, styles.description, { color: isDark ? colors.darkTextSecondary : colors.textSecondary }]}>
            {activity.description}
          </Text>
        </View>

        <TouchableOpacity
          style={[buttonStyles.primary, styles.startButton]}
          onPress={() => router.back()}
        >
          <Text style={buttonStyles.textLight}>Start Activity</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 120,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  icon: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  meta: {
    fontSize: 14,
  },
  description: {
    marginTop: 12,
    lineHeight: 24,
  },
  startButton: {
    marginTop: 12,
  },
});
