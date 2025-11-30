
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

export default function FocusTimerScreen() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsToday, setSessionsToday] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  const startTimer = () => {
    setIsRunning(true);
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          if (!isBreak) {
            setSessionsToday(s => s + 1);
            setIsBreak(true);
            setSeconds(5 * 60);
          } else {
            setIsBreak(false);
            setSeconds(25 * 60);
          }
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
    setIsRunning(false);
  };

  const resetTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsRunning(false);
    setIsBreak(false);
    setSeconds(25 * 60);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={commonStyles.title}>Focus Timer</Text>
        <Text style={commonStyles.text}>
          25-minute focus sessions with 5-minute breaks
        </Text>
      </View>

      <View style={[commonStyles.card, styles.timerCard]}>
        <Text style={styles.modeLabel}>
          {isBreak ? '☕ Break Time' : '📚 Focus Time'}
        </Text>
        <Text style={styles.timerDisplay}>{formatTime(seconds)}</Text>
        <View style={styles.timerButtons}>
          {!isRunning ? (
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

      <View style={commonStyles.card}>
        <Text style={styles.sessionsLabel}>Sessions Today</Text>
        <Text style={styles.sessionsCount}>{sessionsToday}</Text>
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
  timerCard: {
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 24,
  },
  modeLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 24,
  },
  timerDisplay: {
    fontSize: 64,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 32,
  },
  timerButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  timerButton: {
    flex: 1,
  },
  sessionsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  sessionsCount: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
});
