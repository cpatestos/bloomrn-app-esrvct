
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { UserProfile } from '@/types';
import { useRouter } from 'expo-router';

export default function WorkStudyScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const userProfile = await storage.getUserProfile();
    setProfile(userProfile);
  };

  if (!profile) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={commonStyles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>
          {profile.role === 'student' ? 'Study' : 'Shift'}
        </Text>
        <Text style={commonStyles.text}>
          {profile.role === 'student'
            ? 'Plan your study time with Fixed, Focused, and Flex blocks'
            : 'Log your shifts and take micro-rest breaks'}
        </Text>
      </View>

      {profile.role === 'student' ? (
        <>
          <TouchableOpacity
            style={[commonStyles.card, styles.featureCard]}
            onPress={() => router.push('/study/weekly-planner')}
          >
            <Text style={styles.featureIcon}>📅</Text>
            <Text style={styles.featureTitle}>Weekly Planner</Text>
            <Text style={styles.featureDescription}>
              Organize your week with Fixed, Focused, and Flex time blocks
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[commonStyles.card, styles.featureCard]}
            onPress={() => router.push('/study/focus-timer')}
          >
            <Text style={styles.featureIcon}>⏱️</Text>
            <Text style={styles.featureTitle}>Focus Timer</Text>
            <Text style={styles.featureDescription}>
              25-minute focus sessions with 5-minute breaks
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            style={[commonStyles.card, styles.featureCard]}
            onPress={() => router.push('/shift/log-shift')}
          >
            <Text style={styles.featureIcon}>📝</Text>
            <Text style={styles.featureTitle}>Log Shift</Text>
            <Text style={styles.featureDescription}>
              Record your shift details and reflections
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[commonStyles.card, styles.featureCard]}
            onPress={() => router.push('/shift/shift-history')}
          >
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureTitle}>Shift History</Text>
            <Text style={styles.featureDescription}>
              View your past shifts and reflections
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[commonStyles.card, styles.featureCard]}
            onPress={() => router.push('/shift/micro-rest')}
          >
            <Text style={styles.featureIcon}>🧘</Text>
            <Text style={styles.featureTitle}>Micro-Rest Timer</Text>
            <Text style={styles.featureDescription}>
              1-5 minute timers for quick breathing and reset activities
            </Text>
          </TouchableOpacity>
        </>
      )}
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
  featureCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
