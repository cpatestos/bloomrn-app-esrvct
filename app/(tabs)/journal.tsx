
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { JournalEntry, DailyCheckIn } from '@/types';

export default function JournalScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [gratitudeList, setGratitudeList] = useState<{ date: string; items: string[] }[]>([]);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const journalEntries = await storage.getJournalEntries();
      setEntries(journalEntries.sort((a, b) => b.date.localeCompare(a.date)));

      const checkIns = await storage.getDailyCheckIns();
      const gratitude = checkIns
        .filter(c => c.gratitude && c.gratitude.length > 0)
        .map(c => ({ date: c.date, items: c.gratitude }))
        .sort((a, b) => b.date.localeCompare(a.date));
      setGratitudeList(gratitude);
    } catch (error) {
      console.error('Error loading journal data:', error);
    }
  };

  const handleSaveEntry = async () => {
    if (!newEntryContent.trim()) {
      Alert.alert('Required', 'Please write something in your journal');
      return;
    }

    try {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        title: newEntryTitle.trim() || undefined,
        content: newEntryContent.trim(),
      };

      await storage.saveJournalEntry(entry);
      setNewEntryTitle('');
      setNewEntryContent('');
      setShowNewEntry(false);
      loadData();
      Alert.alert('Success', 'Journal entry saved');
    } catch (error) {
      console.error('Error saving entry:', error);
      Alert.alert('Error', 'Failed to save entry');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>Journal & Reflect</Text>
        <Text style={commonStyles.text}>
          Express your thoughts and track your gratitude
        </Text>
      </View>

      <View style={styles.actionButtons}>
        {!showNewEntry ? (
          <TouchableOpacity
            style={[buttonStyles.primary, styles.actionButton]}
            onPress={() => setShowNewEntry(true)}
          >
            <Text style={[buttonStyles.text, { color: '#FFFFFF' }]}>✍️ New Journal Entry</Text>
          </TouchableOpacity>
        ) : null}
        
        <TouchableOpacity
          style={[buttonStyles.outline, styles.actionButton]}
          onPress={() => router.push('/media/record-media')}
        >
          <Text style={buttonStyles.text}>🎤 Record Audio/Video</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[buttonStyles.outline, styles.actionButton]}
          onPress={() => router.push('/media/view-recordings')}
        >
          <Text style={buttonStyles.text}>📁 View Recordings</Text>
        </TouchableOpacity>
      </View>

      {showNewEntry && (
        <View style={[commonStyles.card, styles.newEntryCard]}>
          <Text style={commonStyles.heading}>New Entry</Text>
          <TextInput
            style={[commonStyles.input, styles.titleInput]}
            value={newEntryTitle}
            onChangeText={setNewEntryTitle}
            placeholder="Title (optional)"
            placeholderTextColor={colors.textLight}
          />
          <TextInput
            style={[commonStyles.input, styles.contentInput]}
            value={newEntryContent}
            onChangeText={setNewEntryContent}
            placeholder="Write your thoughts..."
            placeholderTextColor={colors.textLight}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[buttonStyles.outline, styles.cancelButton]}
              onPress={() => {
                setShowNewEntry(false);
                setNewEntryTitle('');
                setNewEntryContent('');
              }}
            >
              <Text style={buttonStyles.text}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[buttonStyles.primary, styles.saveButton]}
              onPress={handleSaveEntry}
            >
              <Text style={[buttonStyles.text, { color: '#FFFFFF' }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={commonStyles.subtitle}>Recent Entries</Text>
        {entries.length === 0 ? (
          <View style={commonStyles.card}>
            <Text style={commonStyles.textSecondary}>
              No journal entries yet. Start writing to track your thoughts and experiences.
            </Text>
          </View>
        ) : (
          entries.slice(0, 5).map((entry, index) => (
            <React.Fragment key={index}>
              <View style={commonStyles.cardSmall}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
                </View>
                {entry.title && (
                  <Text style={commonStyles.heading}>{entry.title}</Text>
                )}
                <Text style={commonStyles.text} numberOfLines={3}>
                  {entry.content}
                </Text>
              </View>
            </React.Fragment>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={commonStyles.subtitle}>Gratitude Log</Text>
        {gratitudeList.length === 0 ? (
          <View style={commonStyles.card}>
            <Text style={commonStyles.textSecondary}>
              Complete your daily check-in to track what you&apos;re grateful for.
            </Text>
          </View>
        ) : (
          gratitudeList.slice(0, 5).map((item, index) => (
            <React.Fragment key={index}>
              <View style={commonStyles.cardSmall}>
                <Text style={styles.entryDate}>{formatDate(item.date)}</Text>
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
  header: {
    marginBottom: 24,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    width: '100%',
  },
  newEntryCard: {
    marginBottom: 24,
  },
  titleInput: {
    marginTop: 12,
  },
  contentInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  entryHeader: {
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gratitudeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  gratitudeBullet: {
    fontSize: 16,
    marginRight: 8,
  },
});
