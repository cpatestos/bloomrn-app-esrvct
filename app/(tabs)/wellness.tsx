
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { UserProfile } from '@/types';

interface Activity {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  icon: string;
}

const activities: Activity[] = [
  {
    id: '1',
    title: 'Deep Breathing',
    description: 'Calm your mind with focused breathing exercises',
    duration: 5,
    category: 'Mindfulness',
    icon: '🌬️',
  },
  {
    id: '2',
    title: 'Body Scan Meditation',
    description: 'Release tension by scanning through your body',
    duration: 10,
    category: 'Mindfulness',
    icon: '🧘‍♀️',
  },
  {
    id: '3',
    title: 'Gratitude Practice',
    description: 'Reflect on things you&apos;re grateful for',
    duration: 5,
    category: 'Mindfulness',
    icon: '🙏',
  },
  {
    id: '4',
    title: 'Gentle Stretching',
    description: 'Release physical tension with simple stretches',
    duration: 10,
    category: 'Body',
    icon: '🤸‍♀️',
  },
  {
    id: '5',
    title: 'Nature Walk',
    description: 'Connect with nature for mental clarity',
    duration: 20,
    category: 'Body',
    icon: '🌳',
  },
  {
    id: '6',
    title: 'Journaling',
    description: 'Express your thoughts and feelings on paper',
    duration: 15,
    category: 'Reflection',
    icon: '📓',
  },
  {
    id: '7',
    title: 'Music Therapy',
    description: 'Listen to calming music to relax',
    duration: 15,
    category: 'Self-Care',
    icon: '🎵',
  },
  {
    id: '8',
    title: 'Tea Break',
    description: 'Enjoy a mindful tea or coffee break',
    duration: 10,
    category: 'Self-Care',
    icon: '☕',
  },
  {
    id: '9',
    title: 'Power Nap',
    description: 'Recharge with a short rest',
    duration: 20,
    category: 'Self-Care',
    icon: '😴',
  },
  {
    id: '10',
    title: 'Creative Expression',
    description: 'Draw, color, or create something',
    duration: 20,
    category: 'Self-Care',
    icon: '🎨',
  },
];

export default function WellnessScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userProfile = await storage.getUserProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const categories = ['All', 'Mindfulness', 'Body', 'Reflection', 'Self-Care'];

  const filteredActivities = selectedCategory === 'All'
    ? activities
    : activities.filter(a => a.category === selectedCategory);

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>Wellness Activities</Text>
        <Text style={commonStyles.text}>
          Choose an activity to support your well-being
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((category, index) => (
          <React.Fragment key={index}>
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipSelected,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category && styles.categoryChipTextSelected,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </ScrollView>

      <View style={styles.activitiesContainer}>
        {filteredActivities.map((activity, index) => (
          <React.Fragment key={index}>
            <TouchableOpacity
              style={commonStyles.card}
              onPress={() => {
                router.push({
                  pathname: '/activity-detail',
                  params: {
                    title: activity.title,
                    description: activity.description,
                    duration: activity.duration,
                    icon: activity.icon,
                  },
                });
              }}
            >
              <View style={styles.activityContent}>
                <Text style={styles.activityIcon}>{activity.icon}</Text>
                <View style={styles.activityInfo}>
                  <Text style={commonStyles.heading}>{activity.title}</Text>
                  <Text style={commonStyles.textSecondary}>{activity.description}</Text>
                  <View style={styles.activityMeta}>
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>⏱️ {activity.duration} min</Text>
                    </View>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{activity.category}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  categoryScroll: {
    marginBottom: 24,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoryContainer: {
    gap: 12,
    paddingRight: 20,
  },
  categoryChip: {
    backgroundColor: colors.card,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
  },
  activitiesContainer: {
    gap: 16,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityMeta: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  durationBadge: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  categoryBadge: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondaryDark,
  },
});
