
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

export default function FocusTimerScreen() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    if (!isBreak) {
      setSessionsCompleted((prev) => prev + 1);
      Alert.alert(
        'Focus Session Complete! 🎉',
        'Great job! Time for a 5-minute break.',
        [
          {
            text: 'Start Break',
            onPress: () => {
              setIsBreak(true);
              setTimeLeft(5 * 60);
              setIsRunning(true);
            },
          },
          { text: 'Skip Break', onPress: () => handleReset() },
        ]
      );
    } else {
      Alert.alert(
        'Break Complete! ✨',
        'Ready for another focus session?',
        [
          {
            text: 'Start Session',
            onPress: () => {
              setIsBreak(false);
              setTimeLeft(25 * 60);
              setIsRunning(true);
            },
          },
          { text: 'Done for Now', onPress: () => handleReset() },
        ]
      );
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(25 * 60);
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={commonStyles.title}>Focus Timer</Text>
        <Text style={commonStyles.text}>
          Use the Pomodoro technique to stay focused
        </Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{sessionsCompleted}</Text>
          <Text style={styles.statLabel}>Sessions Today</Text>
        </View>
      </View>

      <View style={styles.timerCard}>
        <View style={[styles.timerCircle, isBreak && styles.timerCircleBreak]}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          <Text style={styles.timerLabel}>
            {isBreak ? '☕ Break Time' : '📚 Focus Time'}
          </Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[buttonStyles.primary, styles.controlButton]}
            onPress={handleStartPause}
          >
            <Text style={[buttonStyles.text, { color: '#FFFFFF' }]}>
              {isRunning ? '⏸️ Pause' : '▶️ Start'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[buttonStyles.outline, styles.controlButton]}
            onPress={handleReset}
          >
            <Text style={buttonStyles.text}>🔄 Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={commonStyles.heading}>📖 How it works</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoBullet}>1.</Text>
          <Text style={commonStyles.text}>
            Focus for 25 minutes without distractions
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoBullet}>2.</Text>
          <Text style={commonStyles.text}>
            Take a 5-minute break to recharge
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoBullet}>3.</Text>
          <Text style={commonStyles.text}>
            Repeat to build focus and productivity
          </Text>
        </View>
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
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  header: {
    marginBottom: 24,
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 4,
  },
  timerCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 32,
    marginBottom: 24,
    alignItems: 'center',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
    elevation: 5,
  },
  timerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.highlight,
    borderWidth: 8,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  timerCircleBreak: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.secondary,
  },
  timerText: {
    fontSize: 56,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  timerLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 8,
  },
  controls: {
    width: '100%',
    gap: 12,
  },
  controlButton: {
    width: '100%',
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'flex-start',
  },
  infoBullet: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 12,
    width: 24,
  },
});
