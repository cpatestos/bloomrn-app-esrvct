
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { BarrierEntry } from '@/types';

const categories = ['Academic', 'Time', 'Family-Work', 'Financial', 'Health', 'Emotional', 'Other'];

export default function BarriersScreen() {
  const router = useRouter();
  const [barriers, setBarriers] = useState<BarrierEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');
  const [actionStep, setActionStep] = useState('');

  useEffect(() => {
    loadBarriers();
  }, []);

  const loadBarriers = async () => {
    const allBarriers = await storage.getBarriers();
    setBarriers(allBarriers);
  };

  const handleSave = async () => {
    if (!description.trim() || !actionStep.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    const barrier: BarrierEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      category: category as any,
      description: description.trim(),
      actionStep: actionStep.trim(),
    };

    await storage.saveBarrier(barrier);
    setDescription('');
    setActionStep('');
    setShowForm(false);
    loadBarriers();
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={commonStyles.title}>Barriers to Success</Text>
        <Text style={commonStyles.text}>
          Identify challenges and create action steps
        </Text>
      </View>

      {!showForm ? (
        <TouchableOpacity
          style={[buttonStyles.primary, styles.addButton]}
          onPress={() => setShowForm(true)}
        >
          <Text style={buttonStyles.text}>+ Add Barrier</Text>
        </TouchableOpacity>
      ) : (
        <View style={[commonStyles.card, styles.formCard]}>
          <Text style={styles.formTitle}>New Barrier</Text>
          
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
            placeholder="Describe the barrier..."
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
        <Text style={commonStyles.subtitle}>Your Barriers ({barriers.length})</Text>
        {barriers.length === 0 ? (
          <View style={commonStyles.card}>
            <Text style={styles.emptyText}>No barriers logged yet</Text>
          </View>
        ) : (
          barriers.map((barrier, index) => (
            <React.Fragment key={index}>
              <View style={commonStyles.card}>
                <View style={styles.barrierHeader}>
                  <Text style={styles.barrierDate}>{barrier.date}</Text>
                  <Text style={styles.barrierCategory}>{barrier.category}</Text>
                </View>
                <Text style={styles.barrierDescription}>{barrier.description}</Text>
                <View style={styles.actionStepContainer}>
                  <Text style={styles.actionStepLabel}>Action Step:</Text>
                  <Text style={styles.actionStepText}>{barrier.actionStep}</Text>
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
  barrierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  barrierDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  barrierCategory: {
    fontSize: 12,
    color: colors.text,
    backgroundColor: colors.highlight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  barrierDescription: {
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
