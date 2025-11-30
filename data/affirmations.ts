
import { UserRole } from '@/types';

export const affirmations: Record<UserRole, string[]> = {
  student: [
    'You are capable of mastering complex concepts.',
    'Every study session brings you closer to your goals.',
    'Your dedication to learning will serve your future patients well.',
    'It&apos;s okay to ask for help - that&apos;s how you grow.',
    'You are building the foundation for a meaningful career.',
    'Your hard work today creates better outcomes tomorrow.',
    'You have what it takes to succeed in nursing school.',
    'Taking breaks is part of effective learning.',
    'You are more prepared than you think.',
    'Your compassion and knowledge will change lives.',
  ],
  rn: [
    'You made a difference in someone&apos;s life today.',
    'Your expertise and compassion matter deeply.',
    'It&apos;s okay to set boundaries - you can&apos;t pour from an empty cup.',
    'You are allowed to feel what you feel.',
    'Your well-being enables you to care for others.',
    'You handled difficult situations with grace today.',
    'Taking time to recover is professional, not selfish.',
    'You are enough, exactly as you are.',
    'Your presence brings comfort to those in need.',
    'You deserve the same care you give to others.',
  ],
};

export function getRandomAffirmation(role: UserRole): string {
  const roleAffirmations = affirmations[role];
  return roleAffirmations[Math.floor(Math.random() * roleAffirmations.length)];
}
