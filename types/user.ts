export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type FitnessGoal = 'lose_weight' | 'build_muscle' | 'stay_active' | 'improve_stamina';

export interface UserProfile {
  name: string;
  age?: number;
  gender?: Gender;
  height?: number;
  weight?: number;
  fitnessLevel?: FitnessLevel;
  goals: FitnessGoal[];
  onboarded: boolean;
}

export interface Workout {
  id: string;
  name: string;
  duration: number;
  calories: number;
  difficulty: FitnessLevel;
  date: string;
  completed: boolean;
}

export interface ActivityLog {
  id: string;
  date: string;
  workoutId: string;
  caloriesBurned: number;
  duration: number;
}

export interface ProgressData {
  date: string;
  weight?: number;
  caloriesBurned: number;
  workoutMinutes: number;
}
