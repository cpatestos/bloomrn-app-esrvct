
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

export default function CheckInCompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const affirmation = params.affirmation as string;
  const suggestionsStr = params.suggestions as string;
  const suggestions = suggestionsStr ? JSON.parse(suggestionsStr) : [];

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.emoji}>✨</Text>
        <Text style={commonStyles.title}>Check-In Complete!</Text>
      </View>

      <View style={[commonStyles.card, styles.affirmationCard]}>
        <Text style={styles.affirmationLabel}>Your Affirmation</Text>
        <Text style={styles.affirmationText}>{affirmation}</Text>
      </View>

      <View style={styles.section}>
        <Text style={commonStyles.subtitle}>Suggested Self-Care</Text>
        {suggestions.map((suggestion: any, index: number) => (
          <React.Fragment key={index}>
            <View style={commonStyles.card}>
              <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
              <Text style={styles.suggestionDuration}>{suggestion.duration} minutes</Text>
            </View>
          </React.Fragment>
        ))}
      </View>

      <TouchableOpacity
        style={[buttonStyles.primary, styles.button]}
        onPress={() => router.replace('/(tabs)/(home)/')}
      >
        <Text style={buttonStyles.text}>Go to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  affirmationCard: {
    backgroundColor: colors.secondary,
    marginBottom: 32,
  },
  affirmationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  affirmationText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 26,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  suggestionDuration: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  button: {
    width: '100%',
  },
});
