
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { Shift } from '@/types';

export default function ShiftHistoryScreen() {
  const router = useRouter();
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    loadShifts();
  }, []);

  const loadShifts = async () => {
    const allShifts = await storage.getShifts();
    setShifts(allShifts);
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={commonStyles.title}>Shift History</Text>
        <Text style={commonStyles.text}>{shifts.length} shifts logged</Text>
      </View>

      {shifts.length === 0 ? (
        <View style={commonStyles.card}>
          <Text style={styles.emptyText}>No shifts logged yet</Text>
        </View>
      ) : (
        shifts.map((shift, index) => (
          <React.Fragment key={index}>
            <View style={commonStyles.card}>
              <View style={styles.shiftHeader}>
                <Text style={styles.shiftDate}>{shift.date}</Text>
                <Text style={styles.shiftType}>{shift.type}</Text>
              </View>
              <Text style={styles.shiftTime}>
                {shift.startTime} - {shift.endTime}
              </Text>
              {shift.proudOf && (
                <View style={styles.reflection}>
                  <Text style={styles.reflectionLabel}>Proud of:</Text>
                  <Text style={styles.reflectionText}>{shift.proudOf}</Text>
                </View>
              )}
              {shift.meaningfulMoment && (
                <View style={styles.reflection}>
                  <Text style={styles.reflectionLabel}>Meaningful moment:</Text>
                  <Text style={styles.reflectionText}>{shift.meaningfulMoment}</Text>
                </View>
              )}
            </View>
          </React.Fragment>
        ))
      )}
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
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shiftDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  shiftType: {
    fontSize: 14,
    color: colors.textSecondary,
    backgroundColor: colors.highlight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  shiftTime: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  reflection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  reflectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  reflectionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
