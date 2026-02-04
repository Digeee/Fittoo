import { Workout } from '../types/user';

export const mockWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Morning Cardio',
    duration: 30,
    calories: 250,
    difficulty: 'beginner',
    date: '2026-01-24',
    completed: false,
  },
  {
    id: '2',
    name: 'Full Body Strength',
    duration: 45,
    calories: 320,
    difficulty: 'intermediate',
    date: '2026-01-24',
    completed: false,
  },
  {
    id: '3',
    name: 'HIIT Training',
    duration: 25,
    calories: 300,
    difficulty: 'advanced',
    date: '2026-01-25',
    completed: false,
  },
  {
    id: '4',
    name: 'Yoga Flow',
    duration: 40,
    calories: 180,
    difficulty: 'beginner',
    date: '2026-01-26',
    completed: false,
  },
  {
    id: '5',
    name: 'Core Blast',
    duration: 20,
    calories: 150,
    difficulty: 'intermediate',
    date: '2026-01-27',
    completed: false,
  },
];
