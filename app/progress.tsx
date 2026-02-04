import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, TrendingUp, Flame, Clock } from 'lucide-react-native';
import Card from '../components/Card';
import Colors from '../constants/colors';
import { useUser } from '../contexts/UserContext';

export default function ProgressScreen() {
  const router = useRouter();
  const { getWeekProgress, profile } = useUser();
  
  const weekProgress = getWeekProgress();

  const maxCalories = Math.max(...weekProgress.map((d) => d.caloriesBurned), 500);
  const maxMinutes = Math.max(...weekProgress.map((d) => d.workoutMinutes), 60);

  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  const totalCalories = weekProgress.reduce((sum, d) => sum + d.caloriesBurned, 0);
  const totalMinutes = weekProgress.reduce((sum, d) => sum + d.workoutMinutes, 0);
  const activeDays = weekProgress.filter((d) => d.workoutMinutes > 0).length;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Progress</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <View style={styles.statIcon}>
                <Flame size={24} color={Colors.accent} />
              </View>
              <Text style={styles.statValue}>{totalCalories}</Text>
              <Text style={styles.statLabel}>Calories This Week</Text>
            </Card>

            <Card style={styles.statCard}>
              <View style={styles.statIcon}>
                <Clock size={24} color={Colors.primary} />
              </View>
              <Text style={styles.statValue}>{totalMinutes}</Text>
              <Text style={styles.statLabel}>Minutes This Week</Text>
            </Card>

            <Card style={styles.statCard}>
              <View style={styles.statIcon}>
                <TrendingUp size={24} color={Colors.primary} />
              </View>
              <Text style={styles.statValue}>{activeDays}/7</Text>
              <Text style={styles.statLabel}>Active Days</Text>
            </Card>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Calories</Text>
          </View>

          <Card style={styles.chartCard}>
            <View style={styles.chart}>
              {weekProgress.map((day, index) => {
                const heightPercentage = maxCalories > 0 ? (day.caloriesBurned / maxCalories) * 100 : 0;
                
                return (
                  <View key={day.date} style={styles.barContainer}>
                    <View style={styles.barWrapper}>
                      {day.caloriesBurned > 0 && (
                        <Text style={styles.barValue}>{day.caloriesBurned}</Text>
                      )}
                      <View style={styles.barBackground}>
                        <View
                          style={[
                            styles.bar,
                            {
                              height: `${heightPercentage}%`,
                              backgroundColor: Colors.accent,
                            },
                          ]}
                        />
                      </View>
                    </View>
                    <Text style={styles.barLabel}>{getDayLabel(day.date)}</Text>
                  </View>
                );
              })}
            </View>
          </Card>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Minutes</Text>
          </View>

          <Card style={styles.chartCard}>
            <View style={styles.chart}>
              {weekProgress.map((day, index) => {
                const heightPercentage = maxMinutes > 0 ? (day.workoutMinutes / maxMinutes) * 100 : 0;
                
                return (
                  <View key={day.date} style={styles.barContainer}>
                    <View style={styles.barWrapper}>
                      {day.workoutMinutes > 0 && (
                        <Text style={styles.barValue}>{day.workoutMinutes}</Text>
                      )}
                      <View style={styles.barBackground}>
                        <View
                          style={[
                            styles.bar,
                            {
                              height: `${heightPercentage}%`,
                              backgroundColor: Colors.primary,
                            },
                          ]}
                        />
                      </View>
                    </View>
                    <Text style={styles.barLabel}>{getDayLabel(day.date)}</Text>
                  </View>
                );
              })}
            </View>
          </Card>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Goals</Text>
          </View>

          <Card style={styles.goalsCard}>
            {profile.goals.length > 0 ? (
              profile.goals.map((goal, index) => (
                <View key={index} style={styles.goalItem}>
                  <View style={styles.goalDot} />
                  <Text style={styles.goalText}>
                    {goal === 'lose_weight' && 'Lose Weight'}
                    {goal === 'build_muscle' && 'Build Muscle'}
                    {goal === 'stay_active' && 'Stay Active'}
                    {goal === 'improve_stamina' && 'Improve Stamina'}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noGoalsText}>No goals set yet</Text>
            )}
          </Card>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  chartCard: {
    padding: 20,
    marginBottom: 24,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
  },
  barValue: {
    fontSize: 10,
    color: Colors.text,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  barBackground: {
    width: '70%',
    flex: 1,
    backgroundColor: Colors.grayLight,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 8,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
  },
  goalsCard: {
    padding: 20,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  goalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: 12,
  },
  goalText: {
    fontSize: 16,
    color: Colors.text,
  },
  noGoalsText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
});
