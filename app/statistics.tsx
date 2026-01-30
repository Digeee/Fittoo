import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Calendar, TrendingUp, Award, Target } from 'lucide-react-native';
import Card from '@/components/Card';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';

interface WeeklyData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

export default function StatisticsScreen() {
  const { profile, getWeekProgress, activities } = useUser();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  const weeklyData = getWeekProgress();
  
  const chartData: WeeklyData = {
    labels: weeklyData.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })),
    datasets: [
      {
        data: weeklyData.map(d => d.caloriesBurned),
      }
    ]
  };

  const workoutData: WeeklyData = {
    labels: weeklyData.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })),
    datasets: [
      {
        data: weeklyData.map(d => d.workoutMinutes),
      }
    ]
  };

  const getTotalWorkouts = () => {
    return activities.length;
  };

  const getTotalCalories = () => {
    return activities.reduce((sum, activity) => sum + activity.caloriesBurned, 0);
  };

  const getAverageWorkoutTime = () => {
    if (activities.length === 0) return 0;
    const totalMinutes = activities.reduce((sum, activity) => sum + activity.duration, 0);
    return Math.round(totalMinutes / activities.length);
  };

  const getLongestStreak = () => {
    // Simplified streak calculation
    return Math.max(...activities.map(a => 1)); // Placeholder
  };

  const chartConfig = {
    backgroundColor: Colors.white,
    backgroundGradientFrom: Colors.white,
    backgroundGradientTo: Colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(127, 216, 127, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: Colors.primary
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Statistics</Text>
          <TrendingUp size={24} color={Colors.primary} />
        </View>

        {/* Time Range Selector */}
        <View style={styles.timeSelector}>
          {(['week', 'month', 'year'] as const).map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeButton,
                timeRange === range && styles.activeTimeButton
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text style={[
                styles.timeButtonText,
                timeRange === range && styles.activeTimeButtonText
              ]}>
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Overview Cards */}
          <View style={styles.overviewGrid}>
            <Card style={styles.statCard}>
              <View style={styles.statHeader}>
                <Award size={24} color={Colors.primary} />
                <Text style={styles.statLabel}>Total Workouts</Text>
              </View>
              <Text style={styles.statValue}>{getTotalWorkouts()}</Text>
              <Text style={styles.statUnit}>sessions</Text>
            </Card>

            <Card style={styles.statCard}>
              <View style={styles.statHeader}>
                <Target size={24} color={Colors.accent} />
                <Text style={styles.statLabel}>Calories Burned</Text>
              </View>
              <Text style={styles.statValue}>{getTotalCalories()}</Text>
              <Text style={styles.statUnit}>calories</Text>
            </Card>

            <Card style={styles.statCard}>
              <View style={styles.statHeader}>
                <Calendar size={24} color={Colors.text} />
                <Text style={styles.statLabel}>Avg. Duration</Text>
              </View>
              <Text style={styles.statValue}>{getAverageWorkoutTime()}</Text>
              <Text style={styles.statUnit}>minutes</Text>
            </Card>

            <Card style={styles.statCard}>
              <View style={styles.statHeader}>
                <TrendingUp size={24} color={Colors.success} />
                <Text style={styles.statLabel}>Longest Streak</Text>
              </View>
              <Text style={styles.statValue}>{getLongestStreak()}</Text>
              <Text style={styles.statUnit}>days</Text>
            </Card>
          </View>

          {/* Charts Section */}
          <View style={styles.chartsSection}>
            <Card style={styles.chartCard}>
              <Text style={styles.chartTitle}>Calories Burned This Week</Text>
              <LineChart
                data={chartData}
                width={300}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </Card>

            <Card style={styles.chartCard}>
              <Text style={styles.chartTitle}>Workout Minutes This Week</Text>
              <BarChart
                data={workoutData}
                width={300}
                height={220}
                yAxisLabel=""
                yAxisSuffix="min"
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(255, 140, 66, ${opacity})`,
                }}
                style={styles.chart}
              />
            </Card>
          </View>

          {/* Detailed Stats */}
          <Card style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Detailed Analysis</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Most Active Day:</Text>
              <Text style={styles.detailValue}>Wednesday</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Favorite Workout:</Text>
              <Text style={styles.detailValue}>Cardio</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Best Month:</Text>
              <Text style={styles.detailValue}>January 2026</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Consistency Rate:</Text>
              <Text style={styles.detailValue}>85%</Text>
            </View>
          </Card>

          {/* Achievements */}
          <Card style={styles.achievementsCard}>
            <Text style={styles.achievementsTitle}>Recent Achievements</Text>
            
            <View style={styles.achievementItem}>
              <Award size={20} color={Colors.gold || '#FFD700'} fill={Colors.gold || '#FFD700'} />
              <View style={styles.achievementText}>
                <Text style={styles.achievementTitle}>First Workout</Text>
                <Text style={styles.achievementDate}>January 24, 2026</Text>
              </View>
            </View>
            
            <View style={styles.achievementItem}>
              <Award size={20} color={Colors.silver || '#C0C0C0'} fill={Colors.silver || '#C0C0C0'} />
              <View style={styles.achievementText}>
                <Text style={styles.achievementTitle}>7-Day Streak</Text>
                <Text style={styles.achievementDate}>January 30, 2026</Text>
              </View>
            </View>
            
            <View style={styles.achievementItem}>
              <Award size={20} color={Colors.bronze || '#CD7F32'} fill={Colors.bronze || '#CD7F32'} />
              <View style={styles.achievementText}>
                <Text style={styles.achievementTitle}>1000 Calories Burned</Text>
                <Text style={styles.achievementDate}>February 5, 2026</Text>
              </View>
            </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  timeSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: 24,
    marginVertical: 16,
    borderRadius: 16,
    padding: 4,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTimeButton: {
    backgroundColor: Colors.primary,
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
  activeTimeButtonText: {
    color: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    marginBottom: 16,
    padding: 20,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  statUnit: {
    fontSize: 12,
    color: Colors.textLight,
  },
  chartsSection: {
    marginBottom: 24,
  },
  chartCard: {
    marginBottom: 24,
    padding: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  detailsCard: {
    marginBottom: 24,
    padding: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  achievementsCard: {
    padding: 20,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  achievementText: {
    marginLeft: 12,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  achievementDate: {
    fontSize: 12,
    color: Colors.textLight,
  },
});