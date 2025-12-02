
export interface UserProfile {
  id?: string;
  userId?: string;
  firstName: string;
  role: 'student' | 'rn';
  priorities?: string[];
  programType?: 'BSN' | 'ADN' | 'Accelerated';
  semester?: string;
  year?: string;
  yearsExperience?: string;
  setting?: 'Hospital' | 'Clinic' | 'Community';
  hasCompletedOnboarding: boolean;
  avatarUrl?: string;
  avatarEmoji?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DailyCheckIn {
  id?: string;
  userId?: string;
  date: string;
  mood: number;
  stress: number;
  energy: number;
  note?: string;
  gratitude: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface JournalEntry {
  id?: string;
  userId?: string;
  date: string;
  title?: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SelfCareActivity {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  category: 'Body' | 'Mind' | 'Heart' | 'Breathing';
  icon: string;
  roleTag?: 'student' | 'rn' | 'both';
}

export interface TimeBlock {
  id?: string;
  userId?: string;
  day: string;
  startTime: string;
  endTime: string;
  type: 'Fixed' | 'Focused' | 'Flex';
  title?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tracker {
  id?: string;
  userId?: string;
  date: string;
  type: string;
  value: number;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}
