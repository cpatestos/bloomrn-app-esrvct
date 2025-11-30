
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';

export default function WeeklyPlannerScreen() {
  const router = useRouter();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={commonStyles.title}>Weekly Planner</Text>
        <Text style={commonStyles.text}>
          Plan your week with Fixed, Focused, and Flex blocks
        </Text>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Fixed</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.secondary }]} />
          <Text style={styles.legendText}>Focused</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.accent }]} />
          <Text style={styles.legendText}>Flex</Text>
        </View>
      </View>

      <View style={styles.weekView}>
        {days.map((day, index) => (
          <React.Fragment key={index}>
            <View style={styles.dayColumn}>
              <Text style={styles.dayLabel}>{day}</Text>
              <View style={styles.dayContent}>
                <Text style={styles.placeholderText}>Tap to add blocks</Text>
              </View>
            </View>
          </React.Fragment>
        ))}
      </View>

      <View style={[commonStyles.card, styles.infoCard]}>
        <Text style={styles.infoText}>
          📝 This is a placeholder screen. Full weekly planner functionality coming soon!
        </Text>
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
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    color: colors.text,
  },
  weekView: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  dayColumn: {
    flex: 1,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  dayContent: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 8,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: colors.highlight,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
});
