
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

export default function MicroRestScreen() {
  const router = useRouter();
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [seconds, setSeconds] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  const durations = [1, 2, 3, 5];

  const selectDuration = (minutes: number) => {
    setSelectedDuration(minutes);
    setSeconds(minutes * 60);
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsRunning(false);
  };

  const startTimer = () => {
    setIsRunning(true);
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
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
    setSeconds(selectedDuration * 60);
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
        <Text style={commonStyles.title}>Micro-Rest Timer</Text>
        <Text style={commonStyles.text}>
          Quick breathing and reset activities
        </Text>
      </View>

      <View style={styles.durationSelector}>
        <Text style={styles.selectorLabel}>Select Duration</Text>
        <View style={styles.durationButtons}>
          {durations.map((duration, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                style={[
                  styles.durationButton,
                  selectedDuration === duration && styles.durationButtonSelected,
                ]}
                onPress={() => selectDuration(duration)}
              >
                <Text
                  style={[
                    styles.durationButtonText,
                    selectedDuration === duration && styles.durationButtonTextSelected,
                  ]}
                >
                  {duration} min
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>
      </View>

      <View style={[commonStyles.card, styles.timerCard]}>
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
        <Text style={styles.tipsTitle}>💡 Micro-Rest Ideas</Text>
        <Text style={styles.tipText}>• Deep breathing exercises</Text>
        <Text style={styles.tipText}>• Gentle stretching</Text>
        <Text style={styles.tipText}>• Close your eyes and rest</Text>
        <Text style={styles.tipText}>• Mindful observation</Text>
        <Text style={styles.tipText}>• Progressive muscle relaxation</Text>
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
  durationSelector: {
    marginBottom: 24,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  durationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  durationButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  durationButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  durationButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  durationButtonTextSelected: {
    fontWeight: '600',
  },
  timerCard: {
    alignItems: 'center',
    paddingVertical: 40,
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
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
});
