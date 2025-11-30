
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { SelfCareActivity } from '@/types';

export default function ActivityDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const activityId = params.activityId as string;

  const [activity, setActivity] = useState<SelfCareActivity | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadActivity();
  }, [activityId]);

  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  const loadActivity = async () => {
    const activities = await storage.getSelfCareActivities();
    const found = activities.find(a => a.id === activityId);
    if (found) {
      setActivity(found);
      setTimerSeconds(found.durationMinutes * 60);
    }
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerInterval(interval);
  };

  const pauseTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsTimerRunning(false);
    if (activity) {
      setTimerSeconds(activity.durationMinutes * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!activity) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={commonStyles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={commonStyles.title}>{activity.title}</Text>
        <Text style={styles.meta}>
          {activity.durationMinutes} min • {activity.category}
        </Text>
      </View>

      <View style={commonStyles.card}>
        <Text style={styles.description}>{activity.description}</Text>
      </View>

      <View style={[commonStyles.card, styles.timerCard]}>
        <Text style={styles.timerLabel}>Timer</Text>
        <Text style={styles.timerDisplay}>{formatTime(timerSeconds)}</Text>
        <View style={styles.timerButtons}>
          {!isTimerRunning ? (
            <TouchableOpacity
              style={[buttonStyles.primary, styles.timerButton]}
              onPress={startTimer}
            >
              <Text style={buttonStyles.text}>Start</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[buttonStyles.secondary, styles.timerButton]}
              onPress={pauseTimer}
            >
              <Text style={buttonStyles.text}>Pause</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[buttonStyles.outline, styles.timerButton]}
            onPress={resetTimer}
          >
            <Text style={buttonStyles.text}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
  },
  header: {
    marginBottom: 24,
  },
  meta: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  timerCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginTop: 16,
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 16,
  },
  timerDisplay: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
  },
  timerButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  timerButton: {
    flex: 1,
  },
});
