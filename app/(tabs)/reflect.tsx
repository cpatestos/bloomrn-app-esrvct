
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { UserProfile } from '@/types';
import { useRouter } from 'expo-router';

export default function ReflectScreen() {
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
        <Text style={commonStyles.title}>Reflect</Text>
        <Text style={commonStyles.text}>
          Process your experiences and track your growth
        </Text>
      </View>

      <TouchableOpacity
        style={[commonStyles.card, styles.featureCard]}
        onPress={() => router.push(
          profile.role === 'student' ? '/reflect/barriers' : '/reflect/challenges'
        )}
      >
        <Text style={styles.featureIcon}>💭</Text>
        <Text style={styles.featureTitle}>
          {profile.role === 'student' ? 'Barriers to Success' : 'Challenges'}
        </Text>
        <Text style={styles.featureDescription}>
          {profile.role === 'student'
            ? 'Identify barriers and create action steps to overcome them'
            : 'Process workplace challenges and find solutions'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[commonStyles.card, styles.featureCard]}
        onPress={() => router.push('/reflect/gratitude')}
      >
        <Text style={styles.featureIcon}>🙏</Text>
        <Text style={styles.featureTitle}>Gratitude List</Text>
        <Text style={styles.featureDescription}>
          View all your gratitude entries from daily check-ins
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[commonStyles.card, styles.featureCard]}
        onPress={() => router.push('/reflect/journal')}
      >
        <Text style={styles.featureIcon}>📔</Text>
        <Text style={styles.featureTitle}>Journal</Text>
        <Text style={styles.featureDescription}>
          Free-form journaling for deeper reflection
        </Text>
      </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
});
