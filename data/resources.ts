
import { Resource } from '@/types';

export const resources: Resource[] = [
  // Academic Support - Students
  {
    id: 'res-1',
    title: 'Nursing School Study Resources',
    description: 'Free NCLEX prep materials, study guides, and practice questions.',
    category: 'Academic Support',
    actionType: 'url',
    actionValue: 'https://www.registerednursing.org',
  },
  {
    id: 'res-2',
    title: 'Khan Academy - Health & Medicine',
    description: 'Free video lessons on anatomy, physiology, and medical concepts.',
    category: 'Academic Support',
    actionType: 'url',
    actionValue: 'https://www.khanacademy.org/science/health-and-medicine',
  },

  // Wellness & Counseling - Shared
  {
    id: 'res-3',
    title: 'Crisis Text Line',
    description: 'Free 24/7 crisis support via text. Text HOME to 741741.',
    category: 'Crisis Support',
    actionType: 'phone',
    actionValue: '741741',
  },
  {
    id: 'res-4',
    title: 'National Suicide Prevention Lifeline',
    description: 'Free 24/7 support for people in distress. Call or chat online.',
    category: 'Crisis Support',
    actionType: 'phone',
    actionValue: '988',
  },
  {
    id: 'res-5',
    title: 'SAMHSA National Helpline',
    description: 'Free 24/7 treatment referral and information service for mental health and substance use.',
    category: 'Mental Health',
    actionType: 'phone',
    actionValue: '1-800-662-4357',
  },
  {
    id: 'res-6',
    title: 'Headspace for Healthcare Workers',
    description: 'Free meditation and mindfulness app access for healthcare workers.',
    category: 'Wellness',
    actionType: 'url',
    actionValue: 'https://www.headspace.com/health-covid-19',
  },

  // Professional Support - RNs
  {
    id: 'res-7',
    title: 'American Nurses Association',
    description: 'Professional resources, advocacy, and support for registered nurses.',
    category: 'Professional Support',
    actionType: 'url',
    actionValue: 'https://www.nursingworld.org',
  },
  {
    id: 'res-8',
    title: 'Nurse.com',
    description: 'Continuing education, career resources, and nursing news.',
    category: 'Professional Support',
    actionType: 'url',
    actionValue: 'https://www.nurse.com',
  },
  {
    id: 'res-9',
    title: 'The Resilient Nurse',
    description: 'Resources for nurse well-being, burnout prevention, and resilience.',
    category: 'Professional Support',
    actionType: 'url',
    actionValue: 'https://www.theresilientnurse.com',
  },

  // Financial Support - Students
  {
    id: 'res-10',
    title: 'Nurse Corps Scholarship Program',
    description: 'Federal scholarship program for nursing students in exchange for service.',
    category: 'Financial Support',
    actionType: 'url',
    actionValue: 'https://bhw.hrsa.gov/funding/apply-scholarship',
  },
];
