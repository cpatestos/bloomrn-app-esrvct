
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { TimeBlock } from '@/types';
import BotanicalBackground from '@/components/BotanicalBackground';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_TYPES = ['Fixed', 'Focused', 'Flex'] as const;

export default function TimeManagementScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newBlock, setNewBlock] = useState({
    type: 'Fixed' as 'Fixed' | 'Focused' | 'Flex',
    startTime: '',
    endTime: '',
    title: '',
  });

  useEffect(() => {
    loadBlocks();
  }, [selectedDay]);

  const loadBlocks = async () => {
    const allBlocks = await storage.getTimeBlocks();
    const dayBlocks = allBlocks.filter(b => b.day === selectedDay);
    setBlocks(dayBlocks);
  };

  const handleAddBlock = async () => {
    if (!newBlock.startTime || !newBlock.endTime) {
      Alert.alert('Error', 'Please enter start and end times.');
      return;
    }

    const block: TimeBlock = {
      day: selectedDay,
      type: newBlock.type,
      startTime: newBlock.startTime,
      endTime: newBlock.endTime,
      title: newBlock.title || undefined,
    };

    await storage.saveTimeBlock(block);
    setNewBlock({ type: 'Fixed', startTime: '', endTime: '', title: '' });
    setIsAdding(false);
    loadBlocks();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Fixed':
        return colors.primary;
      case 'Focused':
        return colors.secondary;
      case 'Flex':
        return colors.accent;
      default:
        return colors.text;
    }
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[commonStyles.title, { color: textColor }]}>Time Management</Text>
          <Text style={[commonStyles.textSecondary, { color: isDark ? colors.darkTextSecondary : colors.textSecondary }]}>
            Organize Your Week With The 3-F&apos;s Method
          </Text>
        </View>

        <View style={[styles.legendCard, { backgroundColor: cardColor }]}>
          <Text style={[styles.legendTitle, { color: textColor }]}>The 3-F&apos;s Method</Text>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.legendText, { color: textColor }]}>
              <Text style={{ fontWeight: '700' }}>Fixed:</Text> Non-negotiable commitments
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.secondary }]} />
            <Text style={[styles.legendText, { color: textColor }]}>
              <Text style={{ fontWeight: '700' }}>Focused:</Text> Deep work and study time
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
            <Text style={[styles.legendText, { color: textColor }]}>
              <Text style={{ fontWeight: '700' }}>Flex:</Text> Flexible activities
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dayScroll}
          contentContainerStyle={styles.dayContent}
        >
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                { backgroundColor: cardColor },
                selectedDay === day && styles.dayButtonSelected,
              ]}
              onPress={() => setSelectedDay(day)}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  { color: textColor },
                  selectedDay === day && styles.dayButtonTextSelected,
                ]}
              >
                {day.substring(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.blocksSection}>
          <View style={styles.blockHeader}>
            <Text style={[commonStyles.heading, { color: textColor }]}>{selectedDay}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsAdding(!isAdding)}
            >
              <Text style={[styles.addButtonText, { color: colors.primary }]}>
                {isAdding ? '✕' : '+ Add Block'}
              </Text>
            </TouchableOpacity>
          </View>

          {isAdding && (
            <View style={[commonStyles.card, { backgroundColor: cardColor }]}>
              <Text style={[styles.formLabel, { color: textColor }]}>Type</Text>
              <View style={styles.typeButtons}>
                {TIME_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      { backgroundColor: inputBg },
                      newBlock.type === type && { backgroundColor: getTypeColor(type) },
                    ]}
                    onPress={() => setNewBlock({ ...newBlock, type })}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        { color: textColor },
                        newBlock.type === type && { color: '#FFFFFF' },
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.formLabel, { color: textColor }]}>Title (Optional)</Text>
              <TextInput
                style={[commonStyles.input, { backgroundColor: inputBg, color: textColor }]}
                placeholder="e.g., Morning Shift, Study Session"
                placeholderTextColor={isDark ? colors.darkTextSecondary : colors.textLight}
                value={newBlock.title}
                onChangeText={(text) => setNewBlock({ ...newBlock, title: text })}
              />

              <View style={styles.timeRow}>
                <View style={styles.timeInput}>
                  <Text style={[styles.formLabel, { color: textColor }]}>Start Time</Text>
                  <TextInput
                    style={[commonStyles.input, { backgroundColor: inputBg, color: textColor }]}
                    placeholder="9:00 AM"
                    placeholderTextColor={isDark ? colors.darkTextSecondary : colors.textLight}
                    value={newBlock.startTime}
                    onChangeText={(text) => setNewBlock({ ...newBlock, startTime: text })}
                  />
                </View>
                <View style={styles.timeInput}>
                  <Text style={[styles.formLabel, { color: textColor }]}>End Time</Text>
                  <TextInput
                    style={[commonStyles.input, { backgroundColor: inputBg, color: textColor }]}
                    placeholder="5:00 PM"
                    placeholderTextColor={isDark ? colors.darkTextSecondary : colors.textLight}
                    value={newBlock.endTime}
                    onChangeText={(text) => setNewBlock({ ...newBlock, endTime: text })}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[buttonStyles.primary, styles.saveButton]}
                onPress={handleAddBlock}
              >
                <Text style={buttonStyles.textLight}>Save Block</Text>
              </TouchableOpacity>
            </View>
          )}

          {blocks.length === 0 ? (
            <View style={[commonStyles.card, { backgroundColor: cardColor }]}>
              <Text style={[commonStyles.text, { color: isDark ? colors.darkTextSecondary : colors.textSecondary, textAlign: 'center' }]}>
                No time blocks for this day. Add one to get started!
              </Text>
            </View>
          ) : (
            blocks.map((block, index) => (
              <View
                key={index}
                style={[
                  commonStyles.cardSmall,
                  { backgroundColor: cardColor, borderLeftWidth: 4, borderLeftColor: getTypeColor(block.type) },
                ]}
              >
                <View style={styles.blockContent}>
                  <View style={styles.blockInfo}>
                    <Text style={[styles.blockType, { color: getTypeColor(block.type) }]}>
                      {block.type}
                    </Text>
                    {block.title && (
                      <Text style={[commonStyles.heading, { color: textColor }]}>{block.title}</Text>
                    )}
                    <Text style={[commonStyles.textSecondary, { color: isDark ? colors.darkTextSecondary : colors.textSecondary }]}>
                      {block.startTime} - {block.endTime}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
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
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  legendCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendText: {
    fontSize: 14,
    flex: 1,
  },
  dayScroll: {
    marginBottom: 20,
  },
  dayContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dayButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dayButtonTextSelected: {
    color: colors.primaryDark,
  },
  blocksSection: {
    paddingHorizontal: 20,
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeInput: {
    flex: 1,
  },
  saveButton: {
    marginTop: 12,
  },
  blockContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockInfo: {
    flex: 1,
  },
  blockType: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
});
