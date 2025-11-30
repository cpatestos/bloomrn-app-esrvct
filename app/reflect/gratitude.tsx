
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { DailyCheckIn } from '@/types';

export default function GratitudeScreen() {
  const router = useRouter();
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);

  useEffect(() => {
    loadGratitude();
  }, []);

  const loadGratitude = async () => {
    const allCheckIns = await storage.getDailyCheckIns();
    const withGratitude = allCheckIns.filter(c => c.gratitude.length > 0);
    setCheckIns(withGratitude);
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={commonStyles.title}>Gratitude List</Text>
        <Text style={commonStyles.text}>
          All the things you&apos;ve been grateful for
        </Text>
      </View>

      {checkIns.length === 0 ? (
        <View style={commonStyles.card}>
          <Text style={styles.emptyText}>
            No gratitude entries yet. Complete your daily check-in to add some!
          </Text>
        </View>
      ) : (
        checkIns.map((checkIn, index) => (
          <React.Fragment key={index}>
            <View style={commonStyles.card}>
              <Text style={styles.date}>{checkIn.date}</Text>
              {checkIn.gratitude.map((item, itemIndex) => (
                <React.Fragment key={itemIndex}>
                  <Text style={styles.gratitudeItem}>• {item}</Text>
                </React.Fragment>
              ))}
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
    lineHeight: 24,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  gratitudeItem: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
});
