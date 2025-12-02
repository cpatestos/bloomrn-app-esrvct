
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, useColorScheme } from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { JournalEntry } from '@/types';
import BotanicalBackground from '@/components/BotanicalBackground';

export default function JournalScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const journalEntries = await storage.getJournalEntries();
    setEntries(journalEntries.sort((a, b) => b.date.localeCompare(a.date)));
  };

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please write something before saving.');
      return;
    }

    const newEntry: JournalEntry = {
      date: new Date().toISOString().split('T')[0],
      title: title.trim() || undefined,
      content: content.trim(),
    };

    await storage.saveJournalEntry(newEntry);
    setTitle('');
    setContent('');
    setIsWriting(false);
    loadEntries();
    Alert.alert('Success', 'Journal entry saved!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const bgColor = isDark ? colors.darkBackground : colors.background;
  const textColor = isDark ? colors.darkText : colors.text;
  const cardColor = isDark ? colors.darkCard : colors.card;
  const inputBg = isDark ? colors.darkCard : colors.card;

  return (
    <View style={[commonStyles.container, { backgroundColor: bgColor }]}>
      <BotanicalBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[commonStyles.title, { color: textColor }]}>Journal</Text>
          <Text style={[commonStyles.textSecondary, { color: isDark ? colors.darkTextSecondary : colors.textSecondary }]}>
            Reflect On Your Thoughts And Experiences
          </Text>
        </View>

        {!isWriting ? (
          <>
            <TouchableOpacity
              style={[buttonStyles.primary, styles.newEntryButton]}
              onPress={() => setIsWriting(true)}
            >
              <Text style={buttonStyles.textLight}>✍️ New Entry</Text>
            </TouchableOpacity>

            <View style={styles.entries}>
              {entries.length === 0 ? (
                <View style={[commonStyles.card, { backgroundColor: cardColor }]}>
                  <Text style={[commonStyles.text, { color: isDark ? colors.darkTextSecondary : colors.textSecondary, textAlign: 'center' }]}>
                    No journal entries yet. Start writing to capture your thoughts!
                  </Text>
                </View>
              ) : (
                entries.map((entry, index) => (
                  <View key={index} style={[commonStyles.card, { backgroundColor: cardColor }]}>
                    <Text style={[styles.entryDate, { color: isDark ? colors.darkTextSecondary : colors.textSecondary }]}>
                      {formatDate(entry.date)}
                    </Text>
                    {entry.title && (
                      <Text style={[commonStyles.heading, { color: textColor }]}>{entry.title}</Text>
                    )}
                    <Text style={[commonStyles.text, styles.entryContent, { color: isDark ? colors.darkTextSecondary : colors.textSecondary }]} numberOfLines={3}>
                      {entry.content}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </>
        ) : (
          <View style={styles.writeForm}>
            <TextInput
              style={[commonStyles.input, { backgroundColor: inputBg, color: textColor }]}
              placeholder="Title (optional)"
              placeholderTextColor={isDark ? colors.darkTextSecondary : colors.textLight}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[commonStyles.input, styles.contentInput, { backgroundColor: inputBg, color: textColor }]}
              placeholder="Write your thoughts..."
              placeholderTextColor={isDark ? colors.darkTextSecondary : colors.textLight}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[buttonStyles.outline, styles.cancelButton]}
                onPress={() => {
                  setIsWriting(false);
                  setTitle('');
                  setContent('');
                }}
              >
                <Text style={[buttonStyles.text, { color: colors.primary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[buttonStyles.primary, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={buttonStyles.textLight}>Save Entry</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  newEntryButton: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  entries: {
    paddingHorizontal: 20,
  },
  entryDate: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  entryContent: {
    marginTop: 8,
    lineHeight: 22,
  },
  writeForm: {
    paddingHorizontal: 20,
  },
  contentInput: {
    height: 200,
    paddingTop: 14,
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
});
