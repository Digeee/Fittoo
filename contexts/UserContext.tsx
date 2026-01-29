import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { UserProfile, Workout, ActivityLog, ProgressData } from '@/types/user';
import { mockWorkouts } from '@/mocks/workouts';

const STORAGE_KEY = '@fitness_user_profile';
const WORKOUTS_KEY = '@fitness_workouts';
const ACTIVITY_KEY = '@fitness_activity';
const AUTH_TOKEN_KEY = '@fitness_auth_token';
const USER_CREDENTIALS_KEY = '@fitness_user_credentials';

const defaultProfile: UserProfile = {
  name: '',
  goals: [],
  onboarded: false,
};

interface UserCredentials {
  email: string;
  password: string;
  id: string;
}

interface AuthState {
  isAuthenticated: boolean;
  authToken: string | null;
  user: UserCredentials | null;
}

export const [UserProvider, useUser] = createContextHook(() => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [workouts, setWorkouts] = useState<Workout[]>(mockWorkouts);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    authToken: null,
    user: null
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const [profileData, workoutsData, activitiesData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(WORKOUTS_KEY),
        AsyncStorage.getItem(ACTIVITY_KEY),
      ]);

      if (profileData) {
        setProfile(JSON.parse(profileData));
      }
      if (workoutsData) {
        setWorkouts(JSON.parse(workoutsData));
      }
      if (activitiesData) {
        setActivities(JSON.parse(activitiesData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const completeOnboarding = async (userData: Partial<UserProfile>) => {
    await updateProfile({ ...userData, onboarded: true });
  };

  const completeWorkout = async (workoutId: string) => {
    const workout = workouts.find((w) => w.id === workoutId);
    if (!workout) return;

    const updatedWorkouts = workouts.map((w) =>
      w.id === workoutId ? { ...w, completed: true } : w
    );
    setWorkouts(updatedWorkouts);

    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      workoutId,
      caloriesBurned: workout.calories,
      duration: workout.duration,
    };
    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);

    try {
      await Promise.all([
        AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(updatedWorkouts)),
        AsyncStorage.setItem(ACTIVITY_KEY, JSON.stringify(updatedActivities)),
      ]);
    } catch (error) {
      console.error('Error saving workout completion:', error);
    }
  };

  const getWeekProgress = (): ProgressData[] => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map((date) => {
      const dayActivities = activities.filter(
        (a) => a.date.split('T')[0] === date
      );
      return {
        date,
        caloriesBurned: dayActivities.reduce((sum, a) => sum + a.caloriesBurned, 0),
        workoutMinutes: dayActivities.reduce((sum, a) => sum + a.duration, 0),
      };
    });
  };

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayActivities = activities.filter(
      (a) => a.date.split('T')[0] === today
    );
    const todayWorkouts = workouts.filter(
      (w) => w.date === today && w.completed
    );

    return {
      workoutsCompleted: todayWorkouts.length,
      totalWorkouts: workouts.filter((w) => w.date === today).length,
      caloriesBurned: todayActivities.reduce((sum, a) => sum + a.caloriesBurned, 0),
      minutesActive: todayActivities.reduce((sum, a) => sum + a.duration, 0),
    };
  };

  const getStreakDays = () => {
    const sortedDates = activities
      .map((a) => a.date.split('T')[0])
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort()
      .reverse();

    let streak = 0;
    
    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expected = expectedDate.toISOString().split('T')[0];
      
      if (sortedDates[i] === expected) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  return {
    profile,
    workouts,
    activities,
    isLoading,
    updateProfile,
    completeOnboarding,
    completeWorkout,
    getWeekProgress,
    getTodayStats,
    getStreakDays,
  };
});
