
import { supabase } from '@/app/integrations/supabase/client';
import { 
  UserProfile, 
  DailyCheckIn, 
  SelfCareActivity, 
  TimeBlock, 
  Shift, 
  BarrierEntry, 
  ChallengeEntry, 
  JournalEntry 
} from '@/types';
import { TablesInsert, TablesUpdate } from '@/app/integrations/supabase/types';

// Helper to get current user ID
const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};

// Profile Service
export const profileService = {
  async getProfile(): Promise<UserProfile | null> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        console.log('No user logged in');
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (!data) return null;

      // Convert database format to app format
      const profile: UserProfile = {
        firstName: data.first_name,
        role: data.role as 'student' | 'rn',
        priorities: data.priorities as any[],
        hasCompletedOnboarding: data.has_completed_onboarding,
        ...(data.role === 'student' && data.program_type && {
          studentProfile: {
            programType: data.program_type as any,
            semester: data.semester || '',
            year: data.year || '',
          },
        }),
        ...(data.role === 'rn' && data.years_experience && {
          rnProfile: {
            yearsExperience: data.years_experience,
            setting: data.setting as any,
          },
        }),
      };

      return profile;
    } catch (error) {
      console.error('Error in getProfile:', error);
      return null;
    }
  },

  async saveProfile(profile: UserProfile): Promise<boolean> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        console.error('No user logged in');
        return false;
      }

      const dbProfile: TablesInsert<'profiles'> = {
        user_id: userId,
        first_name: profile.firstName,
        role: profile.role,
        priorities: profile.priorities,
        has_completed_onboarding: profile.hasCompletedOnboarding,
        program_type: profile.studentProfile?.programType || null,
        semester: profile.studentProfile?.semester || null,
        year: profile.studentProfile?.year || null,
        years_experience: profile.rnProfile?.yearsExperience || null,
        setting: profile.rnProfile?.setting || null,
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(dbProfile, { onConflict: 'user_id' });

      if (error) {
        console.error('Error saving profile:', error);
        return false;
      }

      console.log('Profile saved successfully');
      return true;
    } catch (error) {
      console.error('Error in saveProfile:', error);
      return false;
    }
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<boolean> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return false;

      const dbUpdates: TablesUpdate<'profiles'> = {};
      
      if (updates.firstName) dbUpdates.first_name = updates.firstName;
      if (updates.role) dbUpdates.role = updates.role;
      if (updates.priorities) dbUpdates.priorities = updates.priorities;
      if (updates.hasCompletedOnboarding !== undefined) {
        dbUpdates.has_completed_onboarding = updates.hasCompletedOnboarding;
      }
      if (updates.studentProfile) {
        dbUpdates.program_type = updates.studentProfile.programType;
        dbUpdates.semester = updates.studentProfile.semester;
        dbUpdates.year = updates.studentProfile.year;
      }
      if (updates.rnProfile) {
        dbUpdates.years_experience = updates.rnProfile.yearsExperience;
        dbUpdates.setting = updates.rnProfile.setting;
      }

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return false;
    }
  },
};

// Daily Check-in Service
export const checkInService = {
  async saveCheckIn(checkIn: DailyCheckIn): Promise<boolean> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return false;

      const dbCheckIn: TablesInsert<'daily_checkins'> = {
        user_id: userId,
        date: checkIn.date,
        mood: checkIn.mood,
        stress: checkIn.stress,
        energy: checkIn.energy,
        note: checkIn.note || null,
        gratitude: checkIn.gratitude,
      };

      const { error } = await supabase
        .from('daily_checkins')
        .upsert(dbCheckIn, { onConflict: 'user_id,date' });

      if (error) {
        console.error('Error saving check-in:', error);
        return false;
      }

      console.log('Check-in saved successfully');
      return true;
    } catch (error) {
      console.error('Error in saveCheckIn:', error);
      return false;
    }
  },

  async getCheckIns(): Promise<DailyCheckIn[]> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return [];

      const { data, error } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching check-ins:', error);
        return [];
      }

      return data.map(d => ({
        id: d.id,
        date: d.date,
        mood: d.mood,
        stress: d.stress,
        energy: d.energy,
        note: d.note || undefined,
        gratitude: d.gratitude,
      }));
    } catch (error) {
      console.error('Error in getCheckIns:', error);
      return [];
    }
  },

  async getTodayCheckIn(): Promise<DailyCheckIn | null> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return null;

      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows returned
        console.error('Error fetching today check-in:', error);
        return null;
      }

      if (!data) return null;

      return {
        id: data.id,
        date: data.date,
        mood: data.mood,
        stress: data.stress,
        energy: data.energy,
        note: data.note || undefined,
        gratitude: data.gratitude,
      };
    } catch (error) {
      console.error('Error in getTodayCheckIn:', error);
      return null;
    }
  },
};

// Self-Care Activities Service
export const selfCareService = {
  async saveActivity(activity: SelfCareActivity): Promise<boolean> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return false;

      const dbActivity: TablesInsert<'self_care_activities'> = {
        user_id: userId,
        title: activity.title,
        description: activity.description,
        duration_minutes: activity.durationMinutes,
        category: activity.category,
        role_tag: activity.roleTag || null,
        is_favorite: activity.isFavorite || false,
      };

      const { error } = await supabase
        .from('self_care_activities')
        .insert(dbActivity);

      if (error) {
        console.error('Error saving activity:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveActivity:', error);
      return false;
    }
  },

  async getActivities(): Promise<SelfCareActivity[]> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return [];

      const { data, error } = await supabase
        .from('self_care_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching activities:', error);
        return [];
      }

      return data.map(d => ({
        id: d.id,
        title: d.title,
        description: d.description,
        durationMinutes: d.duration_minutes,
        category: d.category as any,
        roleTag: d.role_tag as any,
        isFavorite: d.is_favorite,
      }));
    } catch (error) {
      console.error('Error in getActivities:', error);
      return [];
    }
  },

  async toggleFavorite(activityId: string, isFavorite: boolean): Promise<boolean> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return false;

      const { error } = await supabase
        .from('self_care_activities')
        .update({ is_favorite: isFavorite })
        .eq('id', activityId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error toggling favorite:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in toggleFavorite:', error);
      return false;
    }
  },
};

// Time Blocks Service
export const timeBlockService = {
  async saveTimeBlocks(blocks: TimeBlock[]): Promise<boolean> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return false;

      // Delete existing blocks
      await supabase
        .from('time_blocks')
        .delete()
        .eq('user_id', userId);

      // Insert new blocks
      const dbBlocks: TablesInsert<'time_blocks'>[] = blocks.map(b => ({
        user_id: userId,
        day: b.day,
        start_time: b.startTime,
        end_time: b.endTime,
        type: b.type,
        title: b.title || null,
      }));

      const { error } = await supabase
        .from('time_blocks')
        .insert(dbBlocks);

      if (error) {
        console.error('Error saving time blocks:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveTimeBlocks:', error);
      return false;
    }
  },

  async getTimeBlocks(): Promise<TimeBlock[]> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return [];

      const { data, error } = await supabase
        .from('time_blocks')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching time blocks:', error);
        return [];
      }

      return data.map(d => ({
        id: d.id,
        day: d.day,
        startTime: d.start_time,
        endTime: d.end_time,
        type: d.type as any,
        title: d.title || undefined,
      }));
    } catch (error) {
      console.error('Error in getTimeBlocks:', error);
      return [];
    }
  },
};

// Shifts Service
export const shiftService = {
  async saveShift(shift: Shift): Promise<boolean> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return false;

      const dbShift: TablesInsert<'shifts'> = {
        user_id: userId,
        date: shift.date,
        start_time: shift.startTime,
        end_time: shift.endTime,
        type: shift.type,
        proud_of: shift.proudOf || null,
        releasing: shift.releasing || null,
        meaningful_moment: shift.meaningfulMoment || null,
      };

      const { error } = await supabase
        .from('shifts')
        .insert(dbShift);

      if (error) {
        console.error('Error saving shift:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveShift:', error);
      return false;
    }
  },

  async getShifts(): Promise<Shift[]> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return [];

      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching shifts:', error);
        return [];
      }

      return data.map(d => ({
        id: d.id,
        date: d.date,
        startTime: d.start_time,
        endTime: d.end_time,
        type: d.type as any,
        proudOf: d.proud_of || undefined,
        releasing: d.releasing || undefined,
        meaningfulMoment: d.meaningful_moment || undefined,
      }));
    } catch (error) {
      console.error('Error in getShifts:', error);
      return [];
    }
  },
};

// Barriers Service
export const barrierService = {
  async saveBarrier(barrier: BarrierEntry): Promise<boolean> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return false;

      const dbBarrier: TablesInsert<'barriers'> = {
        user_id: userId,
        date: barrier.date,
        category: barrier.category,
        description: barrier.description,
        action_step: barrier.actionStep,
      };

      const { error } = await supabase
        .from('barriers')
        .insert(dbBarrier);

      if (error) {
        console.error('Error saving barrier:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveBarrier:', error);
      return false;
    }
  },

  async getBarriers(): Promise<BarrierEntry[]> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return [];

      const { data, error } = await supabase
        .from('barriers')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching barriers:', error);
        return [];
      }

      return data.map(d => ({
        id: d.id,
        date: d.date,
        category: d.category as any,
        description: d.description,
        actionStep: d.action_step,
      }));
    } catch (error) {
      console.error('Error in getBarriers:', error);
      return [];
    }
  },
};

// Challenges Service
export const challengeService = {
  async saveChallenge(challenge: ChallengeEntry): Promise<boolean> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return false;

      const dbChallenge: TablesInsert<'challenges'> = {
        user_id: userId,
        date: challenge.date,
        category: challenge.category,
        description: challenge.description,
        action_step: challenge.actionStep,
      };

      const { error } = await supabase
        .from('challenges')
        .insert(dbChallenge);

      if (error) {
        console.error('Error saving challenge:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveChallenge:', error);
      return false;
    }
  },

  async getChallenges(): Promise<ChallengeEntry[]> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return [];

      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching challenges:', error);
        return [];
      }

      return data.map(d => ({
        id: d.id,
        date: d.date,
        category: d.category as any,
        description: d.description,
        actionStep: d.action_step,
      }));
    } catch (error) {
      console.error('Error in getChallenges:', error);
      return [];
    }
  },
};

// Journal Service
export const journalService = {
  async saveEntry(entry: JournalEntry): Promise<boolean> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return false;

      const dbEntry: TablesInsert<'journal_entries'> = {
        user_id: userId,
        date: entry.date,
        title: entry.title || null,
        content: entry.content,
      };

      const { error } = await supabase
        .from('journal_entries')
        .insert(dbEntry);

      if (error) {
        console.error('Error saving journal entry:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveEntry:', error);
      return false;
    }
  },

  async getEntries(): Promise<JournalEntry[]> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return [];

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching journal entries:', error);
        return [];
      }

      return data.map(d => ({
        id: d.id,
        date: d.date,
        title: d.title || undefined,
        content: d.content,
      }));
    } catch (error) {
      console.error('Error in getEntries:', error);
      return [];
    }
  },
};
