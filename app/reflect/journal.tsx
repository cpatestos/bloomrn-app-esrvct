
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { JournalEntry } from '@/types';

export default function JournalScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const allEntries = await storage.getJournalEntries();
    setEntries(allEntries);
  };

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert('Missing Content', 'Please write something in your journal');
      return;
    }

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title: title.trim() || undefined,
      content: content.trim(),
    };

    await storage.saveJournalEntry(entry);
    setTitle('');
    setContent('');
    setShowForm(false);
    loadEntries();
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={commonStyles.title}>Journal</Text>
        <Text style={commonStyles.text}>
          Free-form reflection and writing
        </Text>
      </View>

      {!showForm ? (
        <TouchableOpacity
          style={[buttonStyles.primary, styles.addButton]}
          onPress={() => setShowForm(true)}
        >
          <Text style={buttonStyles.text}>+ New Entry</Text>
        </TouchableOpacity>
      ) : (
        <View style={[commonStyles.card, styles.formCard]}>
          <Text style={styles.formTitle}>New Journal Entry</Text>
          
          <Text style={styles.label}>Title (optional)</Text>
          <TextInput
            style={commonStyles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Give your entry a title..."
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={styles.label}>Content</Text>
          <TextInput
            style={[commonStyles.input, styles.textArea]}
            value={content}
            onChangeText={setContent}
            placeholder="Write your thoughts..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={8}
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
        <Text style={commonStyles.subtitle}>Your Entries ({entries.length})</Text>
        {entries.length === 0 ? (
          <View style={commonStyles.card}>
            <Text style={styles.emptyText}>No journal entries yet</Text>
          </View>
        ) : (
          entries.map((entry, index) => (
            <React.Fragment key={index}>
              <View style={commonStyles.card}>
                <Text style={styles.entryDate}>{entry.date}</Text>
                {entry.title && (
                  <Text style={styles.entryTitle}>{entry.title}</Text>
                )}
                <Text style={styles.entryContent}>{entry.content}</Text>
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
  textArea: {
    height: 150,
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
  entryDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  entryContent: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
});
