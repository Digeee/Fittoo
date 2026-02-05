import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { UserProfile, Workout, ActivityLog, ProgressData } from '../types/user';
import { mockWorkouts } from '../mocks/workouts';

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
      const [profileData, workoutsData, activitiesData, authToken, userCredentials] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(WORKOUTS_KEY),
        AsyncStorage.getItem(ACTIVITY_KEY),
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        AsyncStorage.getItem(USER_CREDENTIALS_KEY),
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
      
      // Load authentication state
      if (authToken && userCredentials) {
        setAuthState({
          isAuthenticated: true,
          authToken,
          user: JSON.parse(userCredentials)
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Authentication functions
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call - in real app, this would be an actual API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validation
      if (!email || !password) {
        return { success: false, error: 'Please enter both email and password' };
      }
      
      if (!email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address' };
      }
      
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }
      
      // Check if user exists (for mock implementation)
      const storedCredentials = await AsyncStorage.getItem(USER_CREDENTIALS_KEY);
      if (storedCredentials) {
        const existingUser = JSON.parse(storedCredentials);
        if (existingUser.email === email && existingUser.password === password) {
          // Valid login
          const mockToken = `token_${Date.now()}`;
          
          // Update auth state
          setAuthState({
            isAuthenticated: true,
            authToken: mockToken,
            user: existingUser
          });
          
          // Also load the user's profile
          const storedProfile = await AsyncStorage.getItem(STORAGE_KEY);
          if (storedProfile) {
            setProfile(JSON.parse(storedProfile));
          }
          
          // Save the auth token
          await AsyncStorage.setItem(AUTH_TOKEN_KEY, mockToken);
          
          return { success: true };
        } else {
          return { success: false, error: 'Invalid email or password' };
        }
      } else {
        return { success: false, error: 'No account found with this email' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validation
      if (!email || !password || !name) {
        return { success: false, error: 'Please fill in all fields' };
      }
      
      if (!email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address' };
      }
      
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }
      
      if (name.length < 2) {
        return { success: false, error: 'Name must be at least 2 characters' };
      }
      
      // Check if user already exists
      const storedCredentials = await AsyncStorage.getItem(USER_CREDENTIALS_KEY);
      if (storedCredentials) {
        const existingUser = JSON.parse(storedCredentials);
        if (existingUser.email === email) {
          return { success: false, error: 'An account with this email already exists' };
        }
      }
      
      // Create new user
      const newUser: UserCredentials = {
        email,
        password, // In real app, never store plain text passwords
        id: Date.now().toString()
      };
      
      const mockToken = `token_${Date.now()}`;
      
      // Save to storage
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, mockToken),
        AsyncStorage.setItem(USER_CREDENTIALS_KEY, JSON.stringify(newUser)),
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...defaultProfile, name, onboarded: false }))
      ]);
      
      // Update auth and profile state
      setAuthState({
        isAuthenticated: true,
        authToken: mockToken,
        user: newUser
      });
      
      setProfile({ ...defaultProfile, name, onboarded: false });
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Signup failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      // Clear all auth-related storage
      await Promise.all([
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_CREDENTIALS_KEY)
      ]);
      
      // Reset auth state
      setAuthState({
        isAuthenticated: false,
        authToken: null,
        user: null
      });
      
      // Reset profile (keep workouts and activities for demo purposes)
      setProfile(defaultProfile);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAuthenticated = () => {
    return authState.isAuthenticated && !!authState.authToken;
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
    // User data
    profile,
    workouts,
    activities,
    isLoading,
    
    // Auth functions
    login,
    signup,
    logout,
    isAuthenticated: authState.isAuthenticated,
    authState,
    
    // Profile functions
    updateProfile,
    completeOnboarding,
    completeWorkout,
    getWeekProgress,
    getTodayStats,
    getStreakDays,
  };
});