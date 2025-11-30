
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { UserProfile, DailyCheckIn } from '@/types';
import { getRandomAffirmation } from '@/data/affirmations';
import { defaultSelfCareActivities } from '@/data/selfCareActivities';

export default function HomeScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todayCheckIn, setTodayCheckIn] = useState<DailyCheckIn | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const userProfile = await storage.getUserProfile();
    const checkIn = await storage.getTodayCheckIn();
    setProfile(userProfile);
    setTodayCheckIn(checkIn);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getSuggestions = () => {
    if (!profile) return [];
    const roleActivities = defaultSelfCareActivities.filter(
      a => !a.roleTag || a.roleTag === profile.role
    );
    return roleActivities.sort(() => Math.random() - 0.5).slice(0, 3);
  };

  const getMoodEmoji = (mood: number) => {
    const emojis = ['😔', '😕', '😐', '🙂', '😊'];
    return emojis[mood - 1] || '😐';
  };

  return (
    <ScrollView
      style={commonStyles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={commonStyles.title}>
          Welcome back, {profile?.firstName || 'there'}! 🌸
        </Text>
        <Text style={commonStyles.text}>
          {profile?.role === 'student' ? 'Student Nurse' : 'Registered Nurse'}
        </Text>
      </View>

      {todayCheckIn ? (
        <View style={[commonStyles.card, styles.checkInCard]}>
          <Text style={styles.cardTitle}>Today&apos;s Check-In</Text>
          <View style={styles.checkInRow}>
            <View style={styles.checkInItem}>
              <Text style={styles.checkInLabel}>Mood</Text>
              <Text style={styles.checkInValue}>
                {getMoodEmoji(todayCheckIn.mood)} {todayCheckIn.mood}/5
              </Text>
            </View>
            <View style={styles.checkInItem}>
              <Text style={styles.checkInLabel}>Stress</Text>
              <Text style={styles.checkInValue}>{todayCheckIn.stress}/5</Text>
            </View>
            <View style={styles.checkInItem}>
              <Text style={styles.checkInLabel}>Energy</Text>
              <Text style={styles.checkInValue}>{todayCheckIn.energy}/5</Text>
            </View>
          </View>
          {todayCheckIn.gratitude.length > 0 && (
            <View style={styles.gratitudeSection}>
              <Text style={styles.gratitudeLabel}>Grateful for:</Text>
              {todayCheckIn.gratitude.map((item, index) => (
                <React.Fragment key={index}>
                  <Text style={styles.gratitudeItem}>• {item}</Text>
                </React.Fragment>
              ))}
            </View>
          )}
        </View>
      ) : (
        <View style={[commonStyles.card, styles.promptCard]}>
          <Text style={styles.promptText}>
            You haven&apos;t checked in today. Take a moment to reflect on how you&apos;re feeling.
          </Text>
          <TouchableOpacity
            style={[buttonStyles.primary, styles.checkInButton]}
            onPress={() => router.push('/daily-checkin')}
          >
            <Text style={buttonStyles.text}>Daily Check-In</Text>
          </TouchableOpacity>
        </View>
      )}

      {profile && (
        <View style={[commonStyles.card, styles.affirmationCard]}>
          <Text style={styles.cardTitle}>Your Affirmation</Text>
          <Text style={styles.affirmationText}>
            {getRandomAffirmation(profile.role)}
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={commonStyles.subtitle}>Self-Care Suggestions</Text>
        {getSuggestions().map((activity, index) => (
          <React.Fragment key={index}>
            <View style={commonStyles.card}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityDescription}>{activity.description}</Text>
              <Text style={styles.activityDuration}>{activity.durationMinutes} min • {activity.category}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  checkInCard: {
    backgroundColor: colors.highlight,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  checkInRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  checkInItem: {
    alignItems: 'center',
  },
  checkInLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  checkInValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  gratitudeSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  gratitudeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  gratitudeItem: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  promptCard: {
    backgroundColor: colors.secondary,
    marginBottom: 16,
  },
  promptText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  checkInButton: {
    width: '100%',
  },
  affirmationCard: {
    backgroundColor: colors.accent,
    marginBottom: 16,
  },
  affirmationText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.text,
    lineHeight: 24,
  },
  section: {
    marginTop: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  activityDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  activityDuration: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
