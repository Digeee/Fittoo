import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Calendar, Users, Target, CheckCircle, Circle } from 'lucide-react-native';
import Card from '@/components/Card';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';

interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  startDate: string;
  endDate: string;
  reward: string;
  progress: number;
  totalSteps: number;
  completed: boolean;
  category: 'daily' | 'weekly' | 'monthly';
}

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: '30-Day Plank Challenge',
    description: 'Hold a plank for increasing durations each day',
    participants: 1247,
    startDate: '2026-01-01',
    endDate: '2026-01-30',
    reward: 'Premium Badge',
    progress: 15,
    totalSteps: 30,
    completed: false,
    category: 'monthly'
  },
  {
    id: '2',
    title: '10K Steps Daily',
    description: 'Reach 10,000 steps every day this week',
    participants: 3421,
    startDate: '2026-01-22',
    endDate: '2026-01-28',
    reward: 'Special Avatar',
    progress: 4,
    totalSteps: 7,
    completed: false,
    category: 'weekly'
  },
  {
    id: '3',
    title: 'Morning Workout Streak',
    description: 'Complete a morning workout for 7 consecutive days',
    participants: 892,
    startDate: '2026-01-20',
    endDate: '2026-01-26',
    reward: 'Golden Trophy',
    progress: 7,
    totalSteps: 7,
    completed: true,
    category: 'weekly'
  },
  {
    id: '4',
    title: 'Hydration Hero',
    description: 'Drink 8 glasses of water daily',
    participants: 2156,
    startDate: '2026-01-24',
    endDate: '2026-01-24',
    reward: 'Water Bottle',
    progress: 5,
    totalSteps: 8,
    completed: false,
    category: 'daily'
  }
];

export default function ChallengesScreen() {
  const { profile } = useUser();
  const [activeTab, setActiveTab] = useState<'all' | 'joined' | 'completed'>('all');

  const filteredChallenges = mockChallenges.filter(challenge => {
    if (activeTab === 'joined') return challenge.progress > 0;
    if (activeTab === 'completed') return challenge.completed;
    return true;
  });

  const getCategoryColor = (category: Challenge['category']) => {
    switch (category) {
      case 'daily': return Colors.primary;
      case 'weekly': return Colors.accent;
      case 'monthly': return Colors.text;
      default: return Colors.textLight;
    }
  };

  const getCategoryLabel = (category: Challenge['category']) => {
    switch (category) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return '';
    }
  };

  const joinChallenge = (challengeId: string) => {
    // In a real app, this would make an API call
    console.log(`Joined challenge ${challengeId}`);
  };

  const renderChallenge = ({ item }: { item: Challenge }) => (
    <Card style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <View style={styles.challengeInfo}>
          <View style={styles.challengeTop}>
            <Text style={styles.challengeTitle}>{item.title}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) + '20' }]}>
              <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>
                {getCategoryLabel(item.category)}
              </Text>
            </View>
          </View>
          <Text style={styles.challengeDescription}>{item.description}</Text>
        </View>
        <Trophy size={24} color={item.completed ? Colors.success : Colors.textLight} />
      </View>

      <View style={styles.challengeStats}>
        <View style={styles.statItem}>
          <Users size={16} color={Colors.textLight} />
          <Text style={styles.statText}>{item.participants.toLocaleString()} participants</Text>
        </View>
        <View style={styles.statItem}>
          <Target size={16} color={Colors.textLight} />
          <Text style={styles.statText}>{item.reward}</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            {item.progress}/{item.totalSteps} completed
          </Text>
          <Text style={styles.percentageText}>
            {Math.round((item.progress / item.totalSteps) * 100)}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${(item.progress / item.totalSteps) * 100}%`,
                backgroundColor: item.completed ? Colors.success : Colors.primary
              }
            ]} 
          />
        </View>
      </View>

      {!item.completed && (
        <TouchableOpacity
          style={[
            styles.actionButton,
            item.progress > 0 ? styles.continueButton : styles.joinButton
          ]}
          onPress={() => joinChallenge(item.id)}
        >
          <Text style={styles.actionButtonText}>
            {item.progress > 0 ? 'Continue Challenge' : 'Join Challenge'}
          </Text>
        </TouchableOpacity>
      )}

      {item.completed && (
        <View style={styles.completedSection}>
          <CheckCircle size={20} color={Colors.success} />
          <Text style={styles.completedText}>Challenge Completed!</Text>
        </View>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Challenges</Text>
          <Trophy size={24} color={Colors.primary} />
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'joined' && styles.activeTab]}
            onPress={() => setActiveTab('joined')}
          >
            <Text style={[styles.tabText, activeTab === 'joined' && styles.activeTabText]}>
              Joined
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.statsOverview}>
            <Card style={styles.statsCard}>
              <Text style={styles.statsTitle}>Your Progress</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>3</Text>
                  <Text style={styles.statLabel}>Active</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>12</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>1,247</Text>
                  <Text style={styles.statLabel}>Points</Text>
                </View>
              </View>
            </Card>
          </View>

          <FlatList
            data={filteredChallenges}
            renderItem={renderChallenge}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
          />
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: Colors.primary + '20',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
  activeTabText: {
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  statsOverview: {
    marginBottom: 24,
  },
  statsCard: {
    padding: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
  },
  listContent: {
    gap: 16,
  },
  challengeCard: {
    padding: 20,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  challengeInfo: {
    flex: 1,
    marginRight: 12,
  },
  challengeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
  },
  challengeDescription: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  challengeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600' as const,
  },
  percentageText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '700' as const,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.gray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: Colors.primary,
  },
  continueButton: {
    backgroundColor: Colors.accent,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  completedSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.success + '20',
    borderRadius: 12,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.success,
    marginLeft: 8,
  },
});