
import { SelfCareActivity } from '@/types';

export const defaultSelfCareActivities: SelfCareActivity[] = [
  // Body - Shared
  {
    id: 'body-1',
    title: '5-Minute Stretch',
    description: 'Gentle stretching to release tension in your neck, shoulders, and back. Focus on areas that feel tight.',
    durationMinutes: 5,
    category: 'Body',
  },
  {
    id: 'body-2',
    title: 'Quick Walk',
    description: 'Take a short walk outside or around your space. Notice your surroundings and breathe deeply.',
    durationMinutes: 10,
    category: 'Body',
  },
  {
    id: 'body-3',
    title: 'Hydration Break',
    description: 'Drink a full glass of water slowly. Notice how it feels. Add lemon or cucumber for variety.',
    durationMinutes: 2,
    category: 'Body',
  },
  {
    id: 'body-4',
    title: 'Power Nap',
    description: 'A short 20-minute rest to recharge. Set an alarm and find a quiet, comfortable spot.',
    durationMinutes: 20,
    category: 'Body',
  },

  // Mind - Shared
  {
    id: 'mind-1',
    title: 'Box Breathing',
    description: 'Breathe in for 4, hold for 4, out for 4, hold for 4. Repeat 4 times. Calms your nervous system.',
    durationMinutes: 5,
    category: 'Mind',
  },
  {
    id: 'mind-2',
    title: 'Mindful Moment',
    description: 'Sit quietly and notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.',
    durationMinutes: 5,
    category: 'Mind',
  },
  {
    id: 'mind-3',
    title: 'Brain Dump',
    description: 'Write down everything on your mind for 5 minutes without stopping. No judgment, just release.',
    durationMinutes: 5,
    category: 'Mind',
  },
  {
    id: 'mind-4',
    title: 'Guided Meditation',
    description: 'Use a meditation app or YouTube for a short guided session. Focus on relaxation or stress relief.',
    durationMinutes: 10,
    category: 'Mind',
  },

  // Heart - Shared
  {
    id: 'heart-1',
    title: 'Gratitude List',
    description: 'Write down 3 things you&apos;re grateful for today, no matter how small.',
    durationMinutes: 5,
    category: 'Heart',
  },
  {
    id: 'heart-2',
    title: 'Connect with Someone',
    description: 'Send a text, make a call, or have a quick chat with someone who lifts your spirits.',
    durationMinutes: 10,
    category: 'Heart',
  },
  {
    id: 'heart-3',
    title: 'Self-Compassion Break',
    description: 'Place your hand on your heart. Say: "This is hard. I&apos;m not alone. May I be kind to myself."',
    durationMinutes: 2,
    category: 'Heart',
  },
  {
    id: 'heart-4',
    title: 'Joy Moment',
    description: 'Do something that brings you joy: listen to a favorite song, look at photos, watch a funny video.',
    durationMinutes: 5,
    category: 'Heart',
  },

  // Academic - Students only
  {
    id: 'academic-1',
    title: 'Study Break Ritual',
    description: 'After 25 minutes of studying, take 5 minutes to stand, stretch, and rest your eyes.',
    durationMinutes: 5,
    category: 'Academic',
    roleTag: 'student',
  },
  {
    id: 'academic-2',
    title: 'Concept Review',
    description: 'Teach a concept out loud to yourself or a study buddy. Teaching reinforces learning.',
    durationMinutes: 10,
    category: 'Academic',
    roleTag: 'student',
  },
  {
    id: 'academic-3',
    title: 'Exam Prep Visualization',
    description: 'Close your eyes and visualize yourself calm and confident during your exam.',
    durationMinutes: 5,
    category: 'Academic',
    roleTag: 'student',
  },

  // Boundaries - RNs only
  {
    id: 'boundaries-1',
    title: 'End-of-Shift Ritual',
    description: 'Before leaving work, take 2 minutes to acknowledge what you did well and what you&apos;re leaving behind.',
    durationMinutes: 2,
    category: 'Boundaries',
    roleTag: 'rn',
  },
  {
    id: 'boundaries-2',
    title: 'Say No Practice',
    description: 'Identify one thing you can say no to this week. Practice the words: "I can&apos;t take that on right now."',
    durationMinutes: 5,
    category: 'Boundaries',
    roleTag: 'rn',
  },
  {
    id: 'boundaries-3',
    title: 'Transition Time',
    description: 'Give yourself 10 minutes between work and home. Sit in your car, take a walk, or just breathe.',
    durationMinutes: 10,
    category: 'Boundaries',
    roleTag: 'rn',
  },
  {
    id: 'boundaries-4',
    title: 'Emotional Release',
    description: 'Acknowledge difficult emotions from your shift. Write them down or talk them out, then let them go.',
    durationMinutes: 10,
    category: 'Boundaries',
    roleTag: 'rn',
  },
];
