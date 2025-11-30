
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserProfile,
  DailyCheckIn,
  SelfCareActivity,
  TimeBlock,
  Shift,
  BarrierEntry,
  ChallengeEntry,
  JournalEntry,
} from '@/types';

const KEYS = {
  USER_PROFILE: '@bloom_user_profile',
  DAILY_CHECKINS: '@bloom_daily_checkins',
  SELF_CARE_ACTIVITIES: '@bloom_self_care_activities',
  TIME_BLOCKS: '@bloom_time_blocks',
  SHIFTS: '@bloom_shifts',
  BARRIERS: '@bloom_barriers',
  CHALLENGES: '@bloom_challenges',
  JOURNAL_ENTRIES: '@bloom_journal_entries',
};

export const storage = {
  // User Profile
  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
      console.log('User profile saved:', profile);
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  },

  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  // Daily Check-ins
  async saveDailyCheckIn(checkIn: DailyCheckIn): Promise<void> {
    try {
      const existing = await this.getDailyCheckIns();
      const updated = [checkIn, ...existing.filter(c => c.id !== checkIn.id)];
      await AsyncStorage.setItem(KEYS.DAILY_CHECKINS, JSON.stringify(updated));
      console.log('Daily check-in saved:', checkIn);
    } catch (error) {
      console.error('Error saving daily check-in:', error);
    }
  },

  async getDailyCheckIns(): Promise<DailyCheckIn[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.DAILY_CHECKINS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting daily check-ins:', error);
      return [];
    }
  },

  async getTodayCheckIn(): Promise<DailyCheckIn | null> {
    try {
      const checkIns = await this.getDailyCheckIns();
      const today = new Date().toISOString().split('T')[0];
      return checkIns.find(c => c.date === today) || null;
    } catch (error) {
      console.error('Error getting today check-in:', error);
      return null;
    }
  },

  // Self-Care Activities
  async saveSelfCareActivities(activities: SelfCareActivity[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SELF_CARE_ACTIVITIES, JSON.stringify(activities));
      console.log('Self-care activities saved');
    } catch (error) {
      console.error('Error saving self-care activities:', error);
    }
  },

  async getSelfCareActivities(): Promise<SelfCareActivity[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SELF_CARE_ACTIVITIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting self-care activities:', error);
      return [];
    }
  },

  // Time Blocks
  async saveTimeBlocks(blocks: TimeBlock[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.TIME_BLOCKS, JSON.stringify(blocks));
      console.log('Time blocks saved');
    } catch (error) {
      console.error('Error saving time blocks:', error);
    }
  },

  async getTimeBlocks(): Promise<TimeBlock[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.TIME_BLOCKS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting time blocks:', error);
      return [];
    }
  },

  // Shifts
  async saveShift(shift: Shift): Promise<void> {
    try {
      const existing = await this.getShifts();
      const updated = [shift, ...existing.filter(s => s.id !== shift.id)];
      await AsyncStorage.setItem(KEYS.SHIFTS, JSON.stringify(updated));
      console.log('Shift saved:', shift);
    } catch (error) {
      console.error('Error saving shift:', error);
    }
  },

  async getShifts(): Promise<Shift[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SHIFTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting shifts:', error);
      return [];
    }
  },

  // Barriers
  async saveBarrier(barrier: BarrierEntry): Promise<void> {
    try {
      const existing = await this.getBarriers();
      const updated = [barrier, ...existing.filter(b => b.id !== barrier.id)];
      await AsyncStorage.setItem(KEYS.BARRIERS, JSON.stringify(updated));
      console.log('Barrier saved:', barrier);
    } catch (error) {
      console.error('Error saving barrier:', error);
    }
  },

  async getBarriers(): Promise<BarrierEntry[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.BARRIERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting barriers:', error);
      return [];
    }
  },

  // Challenges
  async saveChallenge(challenge: ChallengeEntry): Promise<void> {
    try {
      const existing = await this.getChallenges();
      const updated = [challenge, ...existing.filter(c => c.id !== challenge.id)];
      await AsyncStorage.setItem(KEYS.CHALLENGES, JSON.stringify(updated));
      console.log('Challenge saved:', challenge);
    } catch (error) {
      console.error('Error saving challenge:', error);
    }
  },

  async getChallenges(): Promise<ChallengeEntry[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CHALLENGES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting challenges:', error);
      return [];
    }
  },

  // Journal Entries
  async saveJournalEntry(entry: JournalEntry): Promise<void> {
    try {
      const existing = await this.getJournalEntries();
      const updated = [entry, ...existing.filter(e => e.id !== entry.id)];
      await AsyncStorage.setItem(KEYS.JOURNAL_ENTRIES, JSON.stringify(updated));
      console.log('Journal entry saved:', entry);
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  },

  async getJournalEntries(): Promise<JournalEntry[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.JOURNAL_ENTRIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting journal entries:', error);
      return [];
    }
  },

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(KEYS));
      console.log('All data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },
};
