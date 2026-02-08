import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlayCircle, TrendingUp, Activity, User, Flame, Trophy, Target, Clock, Award, HeartPulse } from 'lucide-react-native';
import Card from '../components/Card';
import ProgressRing from '../components/ProgressRing';
import Button from '../components/Button';
import Colors from '../constants/colors';
import { useUser } from '../contexts/UserContext';

export default function HomeScreen() {
  const router = useRouter();
  const { profile, getTodayStats, getStreakDays } = useUser();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const todayStats = getTodayStats();
  const streakDays = getStreakDays();

  const workoutProgress = todayStats.totalWorkouts > 0
    ? (todayStats.workoutsCompleted / todayStats.totalWorkouts) * 100
    : 0;

  const caloriesProgress = todayStats.caloriesBurned > 0
    ? Math.min((todayStats.caloriesBurned / 500) * 100, 100)
    : 0;

  const minutesProgress = todayStats.minutesActive > 0
    ? Math.min((todayStats.minutesActive / 30) * 100, 100)
    : 0;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{profile.name || 'Champion'} 👋</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
          >
            <User size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            <Card style={styles.streakCard}>
              <View style={styles.streakContent}>
                <Flame size={32} color={Colors.accent} />
                <View style={styles.streakText}>
                  <Text style={styles.streakNumber}>{streakDays}</Text>
                  <Text style={styles.streakLabel}>Day Streak</Text>
                </View>
              </View>
              <Text style={styles.streakMessage}>
                {streakDays === 0
                  ? 'Start your journey today!'
                  : streakDays === 1
                  ? 'Great start! Keep it up!'
                  : `Amazing! ${streakDays} days strong! 💪`}
              </Text>
            </Card>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today&apos;s Progress</Text>
            </View>

            <Card style={styles.progressCard}>
              <View style={styles.progressRings}>
                <ProgressRing
                  size={100}
                  strokeWidth={8}
                  progress={workoutProgress}
                  color={Colors.primary}
                  label="Workouts"
                  value={`${todayStats.workoutsCompleted}/${todayStats.totalWorkouts}`}
                />
                <ProgressRing
                  size={100}
                  strokeWidth={8}
                  progress={caloriesProgress}
                  color={Colors.accent}
                  label="Calories"
                  value={todayStats.caloriesBurned.toString()}
                />
                <ProgressRing
                  size={100}
                  strokeWidth={8}
                  progress={minutesProgress}
                  color={Colors.primary}
                  label="Minutes"
                  value={todayStats.minutesActive.toString()}
                />
              </View>
            </Card>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
            </View>

            <View style={styles.quickActions}>
              <Card
                style={styles.actionCard}
                onPress={() => router.push('/workouts')}
              >
                <View style={styles.actionIconCircle}>
                  <PlayCircle size={28} color={Colors.accent} />
                </View>
                <Text style={styles.actionTitle}>Start Workout</Text>
                <Text style={styles.actionDesc}>Begin your session</Text>
              </Card>

              <Card
                style={styles.actionCard}
                onPress={() => router.push('/progress')}
              >
                <View style={styles.actionIconCircle}>
                  <TrendingUp size={28} color={Colors.primary} />
                </View>
                <Text style={styles.actionTitle}>View Progress</Text>
                <Text style={styles.actionDesc}>Track your journey</Text>
              </Card>
            </View>

            <View style={styles.todayWorkout}>
              <Card
                style={styles.todayWorkoutCard}
                onPress={() => router.push('/workouts')}
              >
                <View style={styles.todayWorkoutHeader}>
                  <Activity size={24} color={Colors.accent} />
                  <Text style={styles.todayWorkoutBadge}>Recommended</Text>
                </View>
                <Text style={styles.todayWorkoutTitle}>Morning Cardio</Text>
                <Text style={styles.todayWorkoutDetails}>30 min • 250 cal • Beginner</Text>
                <View style={styles.todayWorkoutButton}>
                  <Button
                    title="Start Now"
                    onPress={() => router.push('/workouts')}
                  />
                </View>
              </Card>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: Colors.white,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textLight,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 4,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  streakCard: {
    backgroundColor: Colors.primaryLight,
    marginBottom: 24,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakText: {
    marginLeft: 16,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.primaryDark,
  },
  streakLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  streakMessage: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  progressCard: {
    marginBottom: 32,
  },
  progressRings: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
  },
  actionIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDesc: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
  todayWorkout: {
    marginBottom: 16,
  },
  todayWorkoutCard: {
    padding: 24,
  },
  todayWorkoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  todayWorkoutBadge: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.accent,
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayWorkoutTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  todayWorkoutDetails: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 20,
  },
  todayWorkoutButton: {
    width: '100%',
  },
});
