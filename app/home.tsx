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
  const [pulseAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const slideAnim = useRef(new Animated.Value(50)).current;

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
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeAnim, slideAnim]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}>
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.userName}>{profile.name || 'Champion'} 👋</Text>
              </View>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => router.push('/profile')}
              >
                <User size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {/* Streak Card */}
            <Card style={styles.heroCard}>
              <View style={styles.streakContainer}>
                <View style={styles.streakIconContainer}>
                  <Flame size={32} color={Colors.white} />
                </View>
                <View style={styles.streakContent}>
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

            {/* Today's Progress Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <HeartPulse size={24} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Today's Progress</Text>
              </View>

              <Card style={styles.progressCard}>
                <View style={styles.progressRingsRow}>
                  <View style={styles.progressItem}>
                    <ProgressRing
                      size={90}
                      strokeWidth={8}
                      progress={workoutProgress}
                      color={Colors.primary}
                      label="Workouts"
                      value={`${todayStats.workoutsCompleted}/${todayStats.totalWorkouts}`}
                    />
                  </View>
                  <View style={styles.progressItem}>
                    <ProgressRing
                      size={90}
                      strokeWidth={8}
                      progress={caloriesProgress}
                      color={Colors.accent}
                      label="Calories"
                      value={todayStats.caloriesBurned.toString()}
                    />
                  </View>
                  <View style={styles.progressItem}>
                    <ProgressRing
                      size={90}
                      strokeWidth={8}
                      progress={minutesProgress}
                      color={Colors.primaryDark}
                      label="Minutes"
                      value={todayStats.minutesActive.toString()}
                    />
                  </View>
                </View>
              </Card>
            </View>

            {/* Quick Actions */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Trophy size={24} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Quick Actions</Text>
              </View>

              <View style={styles.quickActionsContainer}>
                <Card
                  style={styles.actionCard}
                  onPress={() => router.push('/workouts')}
                >
                  <View style={styles.actionIconContainer}>
                    <PlayCircle size={28} color={Colors.accent} />
                  </View>
                  <Text style={styles.actionTitle}>Start Workout</Text>
                  <Text style={styles.actionDescription}>Begin your training session</Text>
                </Card>

                <Card
                  style={styles.actionCard}
                  onPress={() => router.push('/progress')}
                >
                  <View style={styles.actionIconContainer}>
                    <TrendingUp size={28} color={Colors.primary} />
                  </View>
                  <Text style={styles.actionTitle}>View Progress</Text>
                  <Text style={styles.actionDescription}>Track your achievements</Text>
                </Card>
              </View>
            </View>

            {/* Daily Challenge */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Target size={24} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Daily Challenge</Text>
              </View>

              <Card style={styles.challengeCard}>
                <View style={styles.challengeHeader}>
                  <Award size={24} color={Colors.gold} />
                  <Text style={styles.challengeBadge}>Challenge</Text>
                </View>
                <Text style={styles.challengeTitle}>Cardio Blast</Text>
                <Text style={styles.challengeDescription}>Complete 30 minutes of cardio activity to earn a badge</Text>
                <View style={styles.challengeProgressContainer}>
                  <View style={styles.progressBarBackground}>
                    <View 
                      style={[
                        styles.progressBarFill, 
                        { width: `${Math.min((todayStats.minutesActive / 30) * 100, 100)}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>{todayStats.minutesActive}/30 min</Text>
                </View>
                <View style={styles.challengeButtonContainer}>
                  <Button
                    title="Take Challenge"
                    variant="primary"
                    onPress={() => router.push('/workouts')}
                  />
                </View>
              </Card>
            </View>

            {/* Recent Activity */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Clock size={24} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Recent Activity</Text>
              </View>
              <Card style={styles.activityCard}>
                <View style={styles.activityItem}>
                  <View style={styles.activityIconContainer}>
                    <PlayCircle size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>Morning Yoga</Text>
                    <Text style={styles.activityTime}>2 hours ago</Text>
                  </View>
                  <Text style={styles.activityCalories}>120 cal</Text>
                </View>
                <View style={styles.activityItem}>
                  <View style={styles.activityIconContainer}>
                    <Activity size={20} color={Colors.accent} />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>Strength Training</Text>
                    <Text style={styles.activityTime}>Yesterday</Text>
                  </View>
                  <Text style={styles.activityCalories}>250 cal</Text>
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
  headerContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.primary,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.white,
    marginTop: 4,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  heroCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: Colors.primary,
    padding: 24,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  streakContent: {
    flex: 1,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: '800' as const,
    color: Colors.white,
  },
  streakLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  streakMessage: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '500' as const,
    opacity: 0.9,
  },
  sectionContainer: {
    marginBottom: 24,
    marginHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginLeft: 10,
  },
  progressCard: {
    padding: 20,
  },
  progressRingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
    justifyContent: 'center',
  },
  actionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  challengeCard: {
    padding: 20,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  challengeBadge: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.gold,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 16,
  },
  challengeProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.gray,
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600' as const,
    minWidth: 60,
    textAlign: 'right',
  },
  challengeButtonContainer: {
    width: '100%',
  },
  activityCard: {
    padding: 0,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
  },
  activityItemLast: {
    borderBottomWidth: 0,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(127, 216, 127, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.textLight,
  },
  activityCalories: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
});
