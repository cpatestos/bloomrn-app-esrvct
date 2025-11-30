
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { ChallengeEntry } from '@/types';

const categories = ['Workload', 'Emotional', 'Team', 'Moral Distress', 'Health', 'Other'];

export default function ChallengesScreen() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<ChallengeEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');
  const [actionStep, setActionStep] = useState('');

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    const allChallenges = await storage.getChallenges();
    setChallenges(allChallenges);
  };

  const handleSave = async () => {
    if (!description.trim() || !actionStep.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    const challenge: ChallengeEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      category: category as any,
      description: description.trim(),
      actionStep: actionStep.trim(),
    };

    await storage.saveChallenge(challenge);
    setDescription('');
    setActionStep('');
    setShowForm(false);
    loadChallenges();
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={commonStyles.title}>Challenges</Text>
        <Text style={commonStyles.text}>
          Process workplace challenges and find solutions
        </Text>
      </View>

      {!showForm ? (
        <TouchableOpacity
          style={[buttonStyles.primary, styles.addButton]}
          onPress={() => setShowForm(true)}
        >
          <Text style={buttonStyles.text}>+ Add Challenge</Text>
        </TouchableOpacity>
      ) : (
        <View style={[commonStyles.card, styles.formCard]}>
          <Text style={styles.formTitle}>New Challenge</Text>
          
          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((cat, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    category === cat && styles.categoryChipSelected,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      category === cat && styles.categoryChipTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </ScrollView>

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[commonStyles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the challenge..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>One Small Action Step</Text>
          <TextInput
            style={[commonStyles.input, styles.textArea]}
            value={actionStep}
            onChangeText={setActionStep}
            placeholder="What's one thing you can do?"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
          />

          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[buttonStyles.outline, styles.formButton]}
              onPress={() => setShowForm(false)}
            >
              <Text style={buttonStyles.text}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[buttonStyles.primary, styles.formButton]}
              onPress={handleSave}
            >
              <Text style={buttonStyles.text}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={commonStyles.subtitle}>Your Challenges ({challenges.length})</Text>
        {challenges.length === 0 ? (
          <View style={commonStyles.card}>
            <Text style={styles.emptyText}>No challenges logged yet</Text>
          </View>
        ) : (
          challenges.map((challenge, index) => (
            <React.Fragment key={index}>
              <View style={commonStyles.card}>
                <View style={styles.challengeHeader}>
                  <Text style={styles.challengeDate}>{challenge.date}</Text>
                  <Text style={styles.challengeCategory}>{challenge.category}</Text>
                </View>
                <Text style={styles.challengeDescription}>{challenge.description}</Text>
                <View style={styles.actionStepContainer}>
                  <Text style={styles.actionStepLabel}>Action Step:</Text>
                  <Text style={styles.actionStepText}>{challenge.actionStep}</Text>
                </View>
              </View>
            </React.Fragment>
          ))
        )}
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
  addButton: {
    width: '100%',
    marginBottom: 24,
  },
  formCard: {
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 8,
  },
  categoryScroll: {
    marginBottom: 12,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: colors.text,
  },
  categoryChipTextSelected: {
    fontWeight: '600',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  formButton: {
    flex: 1,
  },
  section: {
    marginTop: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  challengeCategory: {
    fontSize: 12,
    color: colors.text,
    backgroundColor: colors.highlight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  challengeDescription: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 22,
  },
  actionStepContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionStepLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  actionStepText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
