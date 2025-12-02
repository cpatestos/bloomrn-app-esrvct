
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';

export default function GratitudeScreen() {
  const router = useRouter();
  const [gratitudeList, setGratitudeList] = useState<{ date: string; items: string[] }[]>([]);

  useEffect(() => {
    loadGratitude();
  }, []);

  const loadGratitude = async () => {
    try {
      const checkIns = await storage.getDailyCheckIns();
      const gratitude = checkIns
        .filter(c => c.gratitude && c.gratitude.length > 0)
        .map(c => ({ date: c.date, items: c.gratitude }))
        .sort((a, b) => b.date.localeCompare(a.date));
      setGratitudeList(gratitude);
    } catch (error) {
      console.error('Error loading gratitude:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
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
        <Text style={styles.headerIcon}>🙏</Text>
        <Text style={commonStyles.title}>Gratitude Log</Text>
        <Text style={commonStyles.text}>
          Reflecting on what you&apos;re grateful for
        </Text>
      </View>

      {gratitudeList.length === 0 ? (
        <View style={commonStyles.card}>
          <Text style={styles.emptyIcon}>✨</Text>
          <Text style={commonStyles.heading}>Start Your Gratitude Journey</Text>
          <Text style={commonStyles.textSecondary}>
            Complete your daily check-in to track what you&apos;re grateful for each day.
          </Text>
        </View>
      ) : (
        gratitudeList.map((item, index) => (
          <React.Fragment key={index}>
            <View style={commonStyles.card}>
              <Text style={styles.date}>{formatDate(item.date)}</Text>
              {item.items.map((gratitude, gIndex) => (
                <View key={gIndex} style={styles.gratitudeItem}>
                  <Text style={styles.gratitudeBullet}>💚</Text>
                  <Text style={commonStyles.text}>{gratitude}</Text>
                </View>
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
  headerIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  gratitudeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
  },
  gratitudeBullet: {
    fontSize: 20,
    marginRight: 12,
  },
});
