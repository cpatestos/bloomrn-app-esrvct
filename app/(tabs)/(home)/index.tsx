
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { UserProfile, DailyCheckIn } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todayCheckIn, setTodayCheckIn] = useState<DailyCheckIn | null>(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    loadData();
    setGreeting(getGreeting());
  }, []);

  const loadData = async () => {
    try {
      const userProfile = await storage.getUserProfile();
      setProfile(userProfile);

      const checkIns = await storage.getDailyCheckIns();
      const today = new Date().toISOString().split('T')[0];
      const todayEntry = checkIns.find(c => c.date === today);
      setTodayCheckIn(todayEntry || null);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getMoodEmoji = (mood: number) => {
    const emojis = ['😔', '😕', '😐', '🙂', '😊'];
    return emojis[mood - 1] || '😐';
  };

  const handleDailyCheckIn = () => {
    router.push('/daily-checkin');
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={[colors.primaryLight, colors.background]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.name}>{profile?.firstName || 'Friend'} 🌸</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {profile?.role === 'student' ? '🎓 Student Nurse' : '⚕️ Registered Nurse'}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.mainContent}>
        {!todayCheckIn ? (
          <TouchableOpacity
            style={styles.checkInCard}
            onPress={handleDailyCheckIn}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.checkInGradient}
            >
              <Text style={styles.checkInIcon}>✨</Text>
              <Text style={styles.checkInTitle}>Daily Check-In</Text>
              <Text style={styles.checkInSubtitle}>
                Take a moment to reflect on how you&apos;re feeling
              </Text>
              <View style={styles.checkInButton}>
                <Text style={styles.checkInButtonText}>Start Check-In →</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={commonStyles.card}>
            <View style={styles.checkInComplete}>
              <Text style={styles.checkInCompleteIcon}>✅</Text>
              <View style={styles.checkInCompleteContent}>
                <Text style={commonStyles.heading}>Today&apos;s Check-In Complete</Text>
                <Text style={commonStyles.textSecondary}>
                  Mood: {getMoodEmoji(todayCheckIn.mood)} • Stress: {todayCheckIn.stress}/5 • Energy: {todayCheckIn.energy}/5
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.quickActions}>
          <Text style={commonStyles.subtitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={commonStyles.cardSmall}
            onPress={() => router.push('/(tabs)/wellness')}
          >
            <View style={styles.actionItem}>
              <Text style={styles.actionIcon}>🧘‍♀️</Text>
              <View style={styles.actionContent}>
                <Text style={commonStyles.heading}>Mindfulness & Self-Care</Text>
                <Text style={commonStyles.textSecondary}>
                  Explore activities to support your well-being
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={commonStyles.cardSmall}
            onPress={() => router.push('/(tabs)/journal')}
          >
            <View style={styles.actionItem}>
              <Text style={styles.actionIcon}>📝</Text>
              <View style={styles.actionContent}>
                <Text style={commonStyles.heading}>Journal & Reflect</Text>
                <Text style={commonStyles.textSecondary}>
                  Write about your experiences and feelings
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {profile?.role === 'student' && (
            <TouchableOpacity
              style={commonStyles.cardSmall}
              onPress={() => router.push('/study/focus-timer')}
            >
              <View style={styles.actionItem}>
                <Text style={styles.actionIcon}>⏱️</Text>
                <View style={styles.actionContent}>
                  <Text style={commonStyles.heading}>Focus Timer</Text>
                  <Text style={commonStyles.textSecondary}>
                    Use the Pomodoro technique for studying
                  </Text>
                </View>
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
                <View style={styles.actionContent}>
                  <Text style={commonStyles.heading}>Log Shift</Text>
                  <Text style={commonStyles.textSecondary}>
                    Record and reflect on your shift
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.affirmation}>
          <View style={commonStyles.card}>
            <Text style={styles.affirmationIcon}>💚</Text>
            <Text style={styles.affirmationTitle}>Today&apos;s Affirmation</Text>
            <Text style={styles.affirmationText}>
              {profile?.role === 'student' 
                ? "You are capable of learning and growing every day. Trust in your journey."
                : "You make a difference in the lives you touch. Your care matters."}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 120,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  header: {
    marginBottom: 0,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  name: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  mainContent: {
    paddingHorizontal: 20,
  },
  checkInCard: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0px 4px 16px rgba(79, 195, 247, 0.3)',
    elevation: 5,
  },
  checkInGradient: {
    padding: 24,
    alignItems: 'center',
  },
  checkInIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  checkInTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  checkInSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  checkInButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  checkInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  checkInComplete: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkInCompleteIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  checkInCompleteContent: {
    flex: 1,
  },
  quickActions: {
    marginBottom: 24,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  affirmation: {
    marginBottom: 24,
  },
  affirmationIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 12,
  },
  affirmationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  affirmationText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
});
