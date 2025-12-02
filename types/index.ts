
export type UserRole = 'student' | 'rn';

export type ProgramType = 'BSN' | 'ADN' | 'Accelerated';

export type RNSetting = 'Hospital' | 'Clinic' | 'Community';

export type Priority = 'stress' | 'routines' | 'sleep' | 'boundaries' | 'exam prep' | 'shift recovery';

export interface StudentProfile {
  programType: ProgramType;
  semester: string;
  year: string;
}

export interface RNProfile {
  yearsExperience: string;
  setting: RNSetting;
}

export interface UserProfile {
  firstName: string;
  role: UserRole;
  priorities: Priority[];
  studentProfile?: StudentProfile;
  rnProfile?: RNProfile;
  hasCompletedOnboarding: boolean;
}

export interface DailyCheckIn {
  id: string;
  date: string;
  mood: number;
  stress: number;
  energy: number;
  note?: string;
  gratitude: string[];
}

export interface SelfCareActivity {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  category: 'Body' | 'Mind' | 'Heart' | 'Academic' | 'Boundaries';
  roleTag?: UserRole;
  isFavorite?: boolean;
}

export interface TimeBlock {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  type: 'Fixed' | 'Focused' | 'Flex';
  title?: string;
}

export interface Shift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'Day' | 'Evening' | 'Night';
  proudOf?: string;
  releasing?: string;
  meaningfulMoment?: string;
}

export interface BarrierEntry {
  id: string;
  date: string;
  category: 'Academic' | 'Time' | 'Family-Work' | 'Financial' | 'Health' | 'Emotional' | 'Other';
  description: string;
  actionStep: string;
}

export interface ChallengeEntry {
  id: string;
  date: string;
  category: 'Workload' | 'Emotional' | 'Team' | 'Moral Distress' | 'Health' | 'Other';
  description: string;
  actionStep: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title?: string;
  content: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  actionType: 'url' | 'phone' | 'email';
  actionValue: string;
}
