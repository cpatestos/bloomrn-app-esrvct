
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { UserProfile, DailyCheckIn } from '@/types';

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checkInCount, setCheckInCount] = useState(0);
  const [journalCount, setJournalCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userProfile = await storage.getUserProfile();
      setProfile(userProfile);

      const checkIns = await storage.getDailyCheckIns();
      setCheckInCount(checkIns.length);

      const journals = await storage.getJournalEntries();
      setJournalCount(journals.length);
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const handleChangeRole = () => {
    Alert.alert(
      'Change Role',
      'Are you sure you want to change your role? This will reset your profile.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change',
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.clearUserProfile();
              router.replace('/onboarding/welcome');
            } catch (error) {
              console.error('Error changing role:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>👤</Text>
        </View>
        <Text style={styles.name}>{profile?.firstName || 'User'}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>
            {profile?.role === 'student' ? '🎓 Student Nurse' : '⚕️ Registered Nurse'}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{checkInCount}</Text>
          <Text style={styles.statLabel}>Check-Ins</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{journalCount}</Text>
          <Text style={styles.statLabel}>Journal Entries</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={commonStyles.subtitle}>Quick Actions</Text>
        
        <TouchableOpacity
          style={commonStyles.cardSmall}
          onPress={() => router.push('/daily-checkin')}
        >
          <View style={styles.actionItem}>
            <Text style={styles.actionIcon}>✨</Text>
            <Text style={commonStyles.heading}>Daily Check-In</Text>
          </View>
        </TouchableOpacity>

        {profile?.role === 'student' && (
          <TouchableOpacity
            style={commonStyles.cardSmall}
            onPress={() => router.push('/study/focus-timer')}
          >
            <View style={styles.actionItem}>
              <Text style={styles.actionIcon}>⏱️</Text>
              <Text style={commonStyles.heading}>Focus Timer</Text>
            </View>
          </TouchableOpacity>
        )}

        {profile?.role === 'rn' && (
          <TouchableOpacity
            style={commonStyles.cardSmall}
            onPress={() => router.push('/shift/log-shift')}
          >
            <View style={styles.actionItem}>
              <Text style={styles.actionIcon}>🏥</Text>
              <Text style={commonStyles.heading}>Log Shift</Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={commonStyles.cardSmall}
          onPress={() => router.push('/reflect/gratitude')}
        >
          <View style={styles.actionItem}>
            <Text style={styles.actionIcon}>🙏</Text>
            <Text style={commonStyles.heading}>View Gratitude Log</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={commonStyles.subtitle}>Settings</Text>
        
        <TouchableOpacity
          style={commonStyles.cardSmall}
          onPress={handleChangeRole}
        >
          <View style={styles.actionItem}>
            <Text style={styles.actionIcon}>🔄</Text>
            <Text style={commonStyles.heading}>Change Role</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={commonStyles.textLight}>BloomRN v1.0</Text>
        <Text style={commonStyles.textLight}>Supporting nurses in their journey</Text>
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
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(79, 195, 247, 0.3)',
    elevation: 4,
  },
  avatar: {
    fontSize: 48,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  roleBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 32,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
});
