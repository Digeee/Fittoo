import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Calendar, Clock, Flame, Play } from 'lucide-react-native';
import Card from '../components/Card';

import Colors from '../constants/colors';
import { useUser } from '../contexts/UserContext';
import * as Haptics from 'expo-haptics';

export default function WorkoutsScreen() {
  const router = useRouter();
  const { workouts, completeWorkout } = useUser();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const getWeekDates = () => {
    const today = new Date();
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const weekDates = getWeekDates();

  const getDayLabel = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  const getDateNumber = (date: Date) => {
    return date.getDate();
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const filteredWorkouts = workouts.filter((w) => w.date === selectedDate);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return Colors.primary;
      case 'intermediate':
        return Colors.accent;
      case 'advanced':
        return Colors.error;
      default:
        return Colors.text;
    }
  };

  const handleStartWorkout = async (workoutId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await completeWorkout(workoutId);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Workouts</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Card style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <Calendar size={20} color={Colors.text} />
              <Text style={styles.calendarTitle}>Weekly Plan</Text>
            </View>
            <View style={styles.weekDays}>
              {weekDates.map((date) => {
                const dateStr = formatDate(date);
                const isSelected = dateStr === selectedDate;
                const hasWorkouts = workouts.some((w) => w.date === dateStr);

                return (
                  <TouchableOpacity
                    key={dateStr}
                    style={[
                      styles.dayButton,
                      isSelected && styles.dayButtonSelected,
                    ]}
                    onPress={() => {
                      setSelectedDate(dateStr);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text
                      style={[
                        styles.dayLabel,
                        isSelected && styles.dayLabelSelected,
                      ]}
                    >
                      {getDayLabel(date)}
                    </Text>
                    <Text
                      style={[
                        styles.dayNumber,
                        isSelected && styles.dayNumberSelected,
                      ]}
                    >
                      {getDateNumber(date)}
                    </Text>
                    {hasWorkouts && (
                      <View
                        style={[
                          styles.dayDot,
                          isSelected && styles.dayDotSelected,
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {filteredWorkouts.length > 0
                ? `${filteredWorkouts.length} Workout${filteredWorkouts.length > 1 ? 's' : ''}`
                : 'No Workouts'}
            </Text>
          </View>

          <View style={styles.workoutsList}>
            {filteredWorkouts.map((workout) => (
              <Card key={workout.id} style={styles.workoutCard}>
                <View style={styles.workoutHeader}>
                  <Text style={styles.workoutName}>{workout.name}</Text>
                  <View
                    style={[
                      styles.difficultyBadge,
                      { backgroundColor: getDifficultyColor(workout.difficulty) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.difficultyText,
                        { color: getDifficultyColor(workout.difficulty) },
                      ]}
                    >
                      {workout.difficulty}
                    </Text>
                  </View>
                </View>

                <View style={styles.workoutStats}>
                  <View style={styles.statItem}>
                    <Clock size={16} color={Colors.textLight} />
                    <Text style={styles.statText}>{workout.duration} min</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Flame size={16} color={Colors.textLight} />
                    <Text style={styles.statText}>{workout.calories} cal</Text>
                  </View>
                </View>

                {workout.completed ? (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedText}>✓ Completed</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => handleStartWorkout(workout.id)}
                  >
                    <Play size={20} color={Colors.white} fill={Colors.white} />
                    <Text style={styles.startButtonText}>Start Workout</Text>
                  </TouchableOpacity>
                )}
              </Card>
            ))}

            {filteredWorkouts.length === 0 && (
              <Card style={styles.emptyCard}>
                <Text style={styles.emptyText}>No workouts scheduled for this day</Text>
                <Text style={styles.emptySubtext}>Rest day or add a new workout</Text>
              </Card>
            )}
          </View>
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
  calendarCard: {
    marginBottom: 24,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginLeft: 8,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    minWidth: 44,
  },
  dayButtonSelected: {
    backgroundColor: Colors.primary,
  },
  dayLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
  },
  dayLabelSelected: {
    color: Colors.white,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  dayNumberSelected: {
    color: Colors.white,
  },
  dayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  dayDotSelected: {
    backgroundColor: Colors.white,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  workoutsList: {
    gap: 16,
  },
  workoutCard: {
    padding: 20,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'capitalize' as const,
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  completedBadge: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primaryDark,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textLight,
  },
});
