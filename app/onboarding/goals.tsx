import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Target, Zap, Activity, TrendingUp } from 'lucide-react-native';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Colors from '../../constants/colors';
import { FitnessGoal } from '../../types/user';
import { useUser } from '../../contexts/UserContext';

export default function GoalsScreen() {
  const router = useRouter();
  const { completeOnboarding } = useUser();
  const [selectedGoals, setSelectedGoals] = useState<FitnessGoal[]>([]);

  const goals: { label: string; value: FitnessGoal; icon: any; desc: string }[] = [
    {
      label: 'Lose Weight',
      value: 'lose_weight',
      icon: TrendingUp,
      desc: 'Burn calories and shed pounds',
    },
    {
      label: 'Build Muscle',
      value: 'build_muscle',
      icon: Target,
      desc: 'Get stronger and more toned',
    },
    {
      label: 'Stay Active',
      value: 'stay_active',
      icon: Activity,
      desc: 'Maintain a healthy lifestyle',
    },
    {
      label: 'Improve Stamina',
      value: 'improve_stamina',
      icon: Zap,
      desc: 'Boost endurance and energy',
    },
  ];

  const toggleGoal = (goal: FitnessGoal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleComplete = async () => {
    await completeOnboarding({ goals: selectedGoals });
    router.replace('/home');
  };

  const isValid = selectedGoals.length > 0;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.step}>Step 2 of 2</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>What are your goals?</Text>
          <Text style={styles.subtitle}>Select one or more goals to get started</Text>

          <View style={styles.goalsContainer}>
            {goals.map((goal) => {
              const isSelected = selectedGoals.includes(goal.value);
              const Icon = goal.icon;

              return (
                <Card
                  key={goal.value}
                  style={[styles.goalCard, isSelected && styles.goalCardSelected]}
                  onPress={() => toggleGoal(goal.value)}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      isSelected && styles.iconCircleSelected,
                    ]}
                  >
                    <Icon
                      size={32}
                      color={isSelected ? Colors.primary : Colors.textLight}
                    />
                  </View>
                  <Text
                    style={[
                      styles.goalTitle,
                      isSelected && styles.goalTitleSelected,
                    ]}
                  >
                    {goal.label}
                  </Text>
                  <Text style={styles.goalDesc}>{goal.desc}</Text>
                </Card>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button
            title="Complete Setup"
            onPress={handleComplete}
            disabled={!isValid}
          />
        </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },
  backButton: {
    padding: 4,
  },
  step: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 32,
  },
  goalsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  goalCard: {
    alignItems: 'center',
    paddingVertical: 24,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  goalCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircleSelected: {
    backgroundColor: Colors.white,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  goalTitleSelected: {
    color: Colors.primaryDark,
  },
  goalDesc: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: Colors.white,
  },
});
