
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

export default function ActivityDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { title, description, duration, icon } = params;

  const [timeLeft, setTimeLeft] = useState(Number(duration) * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

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
    setTimeLeft(Number(duration) * 60);
    setIsComplete(false);
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
        <Text style={styles.icon}>{icon}</Text>
        <Text style={commonStyles.title}>{title}</Text>
        <Text style={commonStyles.text}>{description}</Text>
      </View>

      <View style={styles.timerCard}>
        <View style={styles.timerCircle}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          <Text style={styles.timerLabel}>
            {isComplete ? 'Complete!' : isRunning ? 'In Progress' : 'Ready'}
          </Text>
        </View>

        <View style={styles.controls}>
          {!isComplete ? (
            <>
              <TouchableOpacity
                style={[buttonStyles.primary, styles.controlButton]}
                onPress={handleStartPause}
              >
                <Text style={[buttonStyles.text, { color: '#FFFFFF' }]}>
                  {isRunning ? '⏸️ Pause' : '▶️ Start'}
                </Text>
              </TouchableOpacity>
              {timeLeft !== Number(duration) * 60 && (
                <TouchableOpacity
                  style={[buttonStyles.outline, styles.controlButton]}
                  onPress={handleReset}
                >
                  <Text style={buttonStyles.text}>🔄 Reset</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              <View style={styles.completeMessage}>
                <Text style={styles.completeIcon}>✨</Text>
                <Text style={styles.completeText}>
                  Great job! You completed this activity.
                </Text>
              </View>
              <TouchableOpacity
                style={[buttonStyles.primary, styles.controlButton]}
                onPress={handleReset}
              >
                <Text style={[buttonStyles.text, { color: '#FFFFFF' }]}>
                  Do It Again
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[buttonStyles.outline, styles.controlButton]}
                onPress={() => router.back()}
              >
                <Text style={buttonStyles.text}>Back to Wellness</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.tipsCard}>
        <Text style={commonStyles.heading}>💡 Tips</Text>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={commonStyles.text}>
            Find a quiet, comfortable space
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={commonStyles.text}>
            Turn off notifications and distractions
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={commonStyles.text}>
            Focus on your breath and be present
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={commonStyles.text}>
            Be kind to yourself throughout
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
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    fontSize: 80,
    marginBottom: 16,
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
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.highlight,
    borderWidth: 8,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  timerLabel: {
    fontSize: 16,
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
  completeMessage: {
    alignItems: 'center',
    marginBottom: 16,
  },
  completeIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  completeText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  tipsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  tipItem: {
    flexDirection: 'row',
    marginTop: 12,
  },
  tipBullet: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 12,
    fontWeight: '700',
  },
});
