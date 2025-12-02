
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { UserProfile, SelfCareActivity } from '@/types';
import BotanicalBackground from '@/components/BotanicalBackground';

const WELLNESS_ACTIVITIES: SelfCareActivity[] = [
  {
    id: '1',
    title: 'Deep Breathing',
    description: 'Practice deep breathing exercises to calm your mind and reduce stress.',
    durationMinutes: 5,
    category: 'Breathing',
    icon: '🫁',
    roleTag: 'both',
  },
  {
    id: '2',
    title: 'Body Scan Meditation',
    description: 'Relax each part of your body systematically to release tension.',
    durationMinutes: 10,
    category: 'Mind',
    icon: '🧘‍♀️',
    roleTag: 'both',
  },
  {
    id: '3',
    title: 'Gentle Stretching',
    description: 'Simple stretches to relieve physical tension and improve flexibility.',
    durationMinutes: 10,
    category: 'Body',
    icon: '🤸‍♀️',
    roleTag: 'both',
  },
  {
    id: '4',
    title: 'Gratitude Practice',
    description: 'Reflect on three things you&apos;re grateful for today.',
    durationMinutes: 5,
    category: 'Heart',
    icon: '💚',
    roleTag: 'both',
  },
  {
    id: '5',
    title: 'Progressive Muscle Relaxation',
    description: 'Tense and release muscle groups to reduce physical stress.',
    durationMinutes: 15,
    category: 'Body',
    icon: '💪',
    roleTag: 'both',
  },
  {
    id: '6',
    title: 'Mindful Walking',
    description: 'Take a short walk while focusing on your senses and surroundings.',
    durationMinutes: 15,
    category: 'Mind',
    icon: '🚶‍♀️',
    roleTag: 'both',
  },
  {
    id: '7',
    title: 'Study Break Meditation',
    description: 'Quick meditation to refresh your mind between study sessions.',
    durationMinutes: 5,
    category: 'Mind',
    icon: '📚',
    roleTag: 'student',
  },
  {
    id: '8',
    title: 'Post-Shift Decompression',
    description: 'Release the stress of your shift with guided relaxation.',
    durationMinutes: 10,
    category: 'Heart',
    icon: '🏥',
    roleTag: 'rn',
  },
];

export default function WellnessScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const userProfile = await storage.getUserProfile();
    setProfile(userProfile);
  };

  const categories = ['All', 'Breathing', 'Body', 'Mind', 'Heart'];

  const filteredActivities = WELLNESS_ACTIVITIES.filter((activity) => {
    const categoryMatch = selectedCategory === 'All' || activity.category === selectedCategory;
    const roleMatch = activity.roleTag === 'both' || activity.roleTag === profile?.role;
    return categoryMatch && roleMatch;
  });

  const bgColor = isDark ? colors.darkBackground : colors.background;
  const textColor = isDark ? colors.darkText : colors.text;
  const cardColor = isDark ? colors.darkCard : colors.card;

  return (
    <View style={[commonStyles.container, { backgroundColor: bgColor }]}>
      <BotanicalBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[commonStyles.title, { color: textColor }]}>Wellness Activities</Text>
          <Text style={[commonStyles.textSecondary, { color: isDark ? colors.darkTextSecondary : colors.textSecondary }]}>
            Take Time For Self-Care And Mindfulness
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                { backgroundColor: cardColor },
                selectedCategory === category && styles.categoryButtonSelected,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  { color: textColor },
                  selectedCategory === category && styles.categoryButtonTextSelected,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.activities}>
          {filteredActivities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={[commonStyles.card, { backgroundColor: cardColor }]}
              onPress={() => router.push(`/activity-detail?id=${activity.id}`)}
            >
              <View style={styles.activityHeader}>
                <Text style={styles.activityIcon}>{activity.icon}</Text>
                <View style={styles.activityInfo}>
                  <Text style={[commonStyles.heading, { color: textColor }]}>{activity.title}</Text>
                  <Text style={[commonStyles.textSecondary, { color: isDark ? colors.darkTextSecondary : colors.textSecondary }]}>
                    {activity.durationMinutes} minutes • {activity.category}
                  </Text>
                </View>
              </View>
              <Text style={[commonStyles.text, styles.activityDescription, { color: isDark ? colors.darkTextSecondary : colors.textSecondary }]}>
                {activity.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
  categoryScroll: {
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryButtonTextSelected: {
    color: colors.primaryDark,
  },
  activities: {
    paddingHorizontal: 20,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
