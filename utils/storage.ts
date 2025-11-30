
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
import {
  profileService,
  checkInService,
  selfCareService,
  timeBlockService,
  shiftService,
  barrierService,
  challengeService,
  journalService,
} from '@/services/supabaseService';
import { supabase } from '@/app/integrations/supabase/client';

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

// Helper to check if user is authenticated
const isAuthenticated = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
};

export const storage = {
  // User Profile
  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      // Always save to AsyncStorage for offline access
      await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
      console.log('User profile saved to AsyncStorage:', profile);

      // Try to save to Supabase if authenticated
      if (await isAuthenticated()) {
        const success = await profileService.saveProfile(profile);
        if (success) {
          console.log('User profile synced to Supabase');
        }
      }
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  },

  async getUserProfile(): Promise<UserProfile | null> {
    try {
      // Try to get from Supabase first if authenticated
      if (await isAuthenticated()) {
        const profile = await profileService.getProfile();
        if (profile) {
          // Update local cache
          await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
          return profile;
        }
      }

      // Fallback to AsyncStorage
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
      // Save to AsyncStorage
      const existing = await this.getDailyCheckInsLocal();
      const updated = [checkIn, ...existing.filter(c => c.id !== checkIn.id)];
      await AsyncStorage.setItem(KEYS.DAILY_CHECKINS, JSON.stringify(updated));
      console.log('Daily check-in saved to AsyncStorage:', checkIn);

      // Sync to Supabase if authenticated
      if (await isAuthenticated()) {
        const success = await checkInService.saveCheckIn(checkIn);
        if (success) {
          console.log('Check-in synced to Supabase');
        }
      }
    } catch (error) {
      console.error('Error saving daily check-in:', error);
    }
  },

  async getDailyCheckIns(): Promise<DailyCheckIn[]> {
    try {
      // Try Supabase first if authenticated
      if (await isAuthenticated()) {
        const checkIns = await checkInService.getCheckIns();
        if (checkIns.length > 0) {
          // Update local cache
          await AsyncStorage.setItem(KEYS.DAILY_CHECKINS, JSON.stringify(checkIns));
          return checkIns;
        }
      }

      // Fallback to AsyncStorage
      return await this.getDailyCheckInsLocal();
    } catch (error) {
      console.error('Error getting daily check-ins:', error);
      return [];
    }
  },

  async getDailyCheckInsLocal(): Promise<DailyCheckIn[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.DAILY_CHECKINS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting local check-ins:', error);
      return [];
    }
  },

  async getTodayCheckIn(): Promise<DailyCheckIn | null> {
    try {
      // Try Supabase first if authenticated
      if (await isAuthenticated()) {
        const checkIn = await checkInService.getTodayCheckIn();
        if (checkIn) return checkIn;
      }

      // Fallback to AsyncStorage
      const checkIns = await this.getDailyCheckInsLocal();
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
      console.log('Self-care activities saved to AsyncStorage');
    } catch (error) {
      console.error('Error saving self-care activities:', error);
    }
  },

  async getSelfCareActivities(): Promise<SelfCareActivity[]> {
    try {
      // Try Supabase first if authenticated
      if (await isAuthenticated()) {
        const activities = await selfCareService.getActivities();
        if (activities.length > 0) {
          await AsyncStorage.setItem(KEYS.SELF_CARE_ACTIVITIES, JSON.stringify(activities));
          return activities;
        }
      }

      // Fallback to AsyncStorage
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
      console.log('Time blocks saved to AsyncStorage');

      // Sync to Supabase if authenticated
      if (await isAuthenticated()) {
        const success = await timeBlockService.saveTimeBlocks(blocks);
        if (success) {
          console.log('Time blocks synced to Supabase');
        }
      }
    } catch (error) {
      console.error('Error saving time blocks:', error);
    }
  },

  async getTimeBlocks(): Promise<TimeBlock[]> {
    try {
      // Try Supabase first if authenticated
      if (await isAuthenticated()) {
        const blocks = await timeBlockService.getTimeBlocks();
        if (blocks.length > 0) {
          await AsyncStorage.setItem(KEYS.TIME_BLOCKS, JSON.stringify(blocks));
          return blocks;
        }
      }

      // Fallback to AsyncStorage
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
      const existing = await this.getShiftsLocal();
      const updated = [shift, ...existing.filter(s => s.id !== shift.id)];
      await AsyncStorage.setItem(KEYS.SHIFTS, JSON.stringify(updated));
      console.log('Shift saved to AsyncStorage:', shift);

      // Sync to Supabase if authenticated
      if (await isAuthenticated()) {
        const success = await shiftService.saveShift(shift);
        if (success) {
          console.log('Shift synced to Supabase');
        }
      }
    } catch (error) {
      console.error('Error saving shift:', error);
    }
  },

  async getShifts(): Promise<Shift[]> {
    try {
      // Try Supabase first if authenticated
      if (await isAuthenticated()) {
        const shifts = await shiftService.getShifts();
        if (shifts.length > 0) {
          await AsyncStorage.setItem(KEYS.SHIFTS, JSON.stringify(shifts));
          return shifts;
        }
      }

      // Fallback to AsyncStorage
      return await this.getShiftsLocal();
    } catch (error) {
      console.error('Error getting shifts:', error);
      return [];
    }
  },

  async getShiftsLocal(): Promise<Shift[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SHIFTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting local shifts:', error);
      return [];
    }
  },

  // Barriers
  async saveBarrier(barrier: BarrierEntry): Promise<void> {
    try {
      const existing = await this.getBarriersLocal();
      const updated = [barrier, ...existing.filter(b => b.id !== barrier.id)];
      await AsyncStorage.setItem(KEYS.BARRIERS, JSON.stringify(updated));
      console.log('Barrier saved to AsyncStorage:', barrier);

      // Sync to Supabase if authenticated
      if (await isAuthenticated()) {
        const success = await barrierService.saveBarrier(barrier);
        if (success) {
          console.log('Barrier synced to Supabase');
        }
      }
    } catch (error) {
      console.error('Error saving barrier:', error);
    }
  },

  async getBarriers(): Promise<BarrierEntry[]> {
    try {
      // Try Supabase first if authenticated
      if (await isAuthenticated()) {
        const barriers = await barrierService.getBarriers();
        if (barriers.length > 0) {
          await AsyncStorage.setItem(KEYS.BARRIERS, JSON.stringify(barriers));
          return barriers;
        }
      }

      // Fallback to AsyncStorage
      return await this.getBarriersLocal();
    } catch (error) {
      console.error('Error getting barriers:', error);
      return [];
    }
  },

  async getBarriersLocal(): Promise<BarrierEntry[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.BARRIERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting local barriers:', error);
      return [];
    }
  },

  // Challenges
  async saveChallenge(challenge: ChallengeEntry): Promise<void> {
    try {
      const existing = await this.getChallengesLocal();
      const updated = [challenge, ...existing.filter(c => c.id !== challenge.id)];
      await AsyncStorage.setItem(KEYS.CHALLENGES, JSON.stringify(updated));
      console.log('Challenge saved to AsyncStorage:', challenge);

      // Sync to Supabase if authenticated
      if (await isAuthenticated()) {
        const success = await challengeService.saveChallenge(challenge);
        if (success) {
          console.log('Challenge synced to Supabase');
        }
      }
    } catch (error) {
      console.error('Error saving challenge:', error);
    }
  },

  async getChallenges(): Promise<ChallengeEntry[]> {
    try {
      // Try Supabase first if authenticated
      if (await isAuthenticated()) {
        const challenges = await challengeService.getChallenges();
        if (challenges.length > 0) {
          await AsyncStorage.setItem(KEYS.CHALLENGES, JSON.stringify(challenges));
          return challenges;
        }
      }

      // Fallback to AsyncStorage
      return await this.getChallengesLocal();
    } catch (error) {
      console.error('Error getting challenges:', error);
      return [];
    }
  },

  async getChallengesLocal(): Promise<ChallengeEntry[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CHALLENGES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting local challenges:', error);
      return [];
    }
  },

  // Journal Entries
  async saveJournalEntry(entry: JournalEntry): Promise<void> {
    try {
      const existing = await this.getJournalEntriesLocal();
      const updated = [entry, ...existing.filter(e => e.id !== entry.id)];
      await AsyncStorage.setItem(KEYS.JOURNAL_ENTRIES, JSON.stringify(updated));
      console.log('Journal entry saved to AsyncStorage:', entry);

      // Sync to Supabase if authenticated
      if (await isAuthenticated()) {
        const success = await journalService.saveEntry(entry);
        if (success) {
          console.log('Journal entry synced to Supabase');
        }
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  },

  async getJournalEntries(): Promise<JournalEntry[]> {
    try {
      // Try Supabase first if authenticated
      if (await isAuthenticated()) {
        const entries = await journalService.getEntries();
        if (entries.length > 0) {
          await AsyncStorage.setItem(KEYS.JOURNAL_ENTRIES, JSON.stringify(entries));
          return entries;
        }
      }

      // Fallback to AsyncStorage
      return await this.getJournalEntriesLocal();
    } catch (error) {
      console.error('Error getting journal entries:', error);
      return [];
    }
  },

  async getJournalEntriesLocal(): Promise<JournalEntry[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.JOURNAL_ENTRIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting local journal entries:', error);
      return [];
    }
  },

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(KEYS));
      console.log('All local data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },
};
