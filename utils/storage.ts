
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, DailyCheckIn, JournalEntry, TimeBlock } from '@/types';

const KEYS = {
  USER_PROFILE: '@bloom_user_profile',
  DAILY_CHECKINS: '@bloom_daily_checkins',
  JOURNAL_ENTRIES: '@bloom_journal_entries',
  TIME_BLOCKS: '@bloom_time_blocks',
};

export const storage = {
  // User Profile
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
      console.log('✅ Profile saved:', profile);
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  },

  async clearUserProfile(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.USER_PROFILE);
      console.log('✅ Profile cleared');
    } catch (error) {
      console.error('Error clearing user profile:', error);
    }
  },

  // Daily Check-ins
  async getDailyCheckIns(): Promise<DailyCheckIn[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.DAILY_CHECKINS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting daily check-ins:', error);
      return [];
    }
  },

  async saveDailyCheckIn(checkIn: DailyCheckIn): Promise<void> {
    try {
      const checkIns = await this.getDailyCheckIns();
      const existingIndex = checkIns.findIndex(c => c.date === checkIn.date);
      
      if (existingIndex >= 0) {
        checkIns[existingIndex] = checkIn;
      } else {
        checkIns.push(checkIn);
      }
      
      await AsyncStorage.setItem(KEYS.DAILY_CHECKINS, JSON.stringify(checkIns));
      console.log('✅ Daily check-in saved');
    } catch (error) {
      console.error('Error saving daily check-in:', error);
    }
  },

  // Journal Entries
  async getJournalEntries(): Promise<JournalEntry[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.JOURNAL_ENTRIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting journal entries:', error);
      return [];
    }
  },

  async saveJournalEntry(entry: JournalEntry): Promise<void> {
    try {
      const entries = await this.getJournalEntries();
      entries.push(entry);
      await AsyncStorage.setItem(KEYS.JOURNAL_ENTRIES, JSON.stringify(entries));
      console.log('✅ Journal entry saved');
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  },

  // Time Blocks
  async getTimeBlocks(): Promise<TimeBlock[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.TIME_BLOCKS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting time blocks:', error);
      return [];
    }
  },

  async saveTimeBlock(block: TimeBlock): Promise<void> {
    try {
      const blocks = await this.getTimeBlocks();
      blocks.push(block);
      await AsyncStorage.setItem(KEYS.TIME_BLOCKS, JSON.stringify(blocks));
      console.log('✅ Time block saved');
    } catch (error) {
      console.error('Error saving time block:', error);
    }
  },

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        KEYS.USER_PROFILE,
        KEYS.DAILY_CHECKINS,
        KEYS.JOURNAL_ENTRIES,
        KEYS.TIME_BLOCKS,
      ]);
      console.log('✅ All data cleared');
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  },
};
