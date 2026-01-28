import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Clock, Calendar, Plus, Trash2, Edit3 } from 'lucide-react-native';
import Card from '@/components/Card';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';

interface Reminder {
  id: string;
  title: string;
  time: string;
  days: string[];
  enabled: boolean;
  type: 'workout' | 'meal' | 'water' | 'sleep';
}

const mockReminders: Reminder[] = [
  {
    id: '1',
    title: 'Morning Workout',
    time: '07:00',
    days: ['Mon', 'Wed', 'Fri'],
    enabled: true,
    type: 'workout'
  },
  {
    id: '2',
    title: 'Lunch Time',
    time: '12:30',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    enabled: true,
    type: 'meal'
  },
  {
    id: '3',
    title: 'Stay Hydrated',
    time: '10:00',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    enabled: false,
    type: 'water'
  },
  {
    id: '4',
    title: 'Bed Time',
    time: '22:30',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    enabled: true,
    type: 'sleep'
  }
];

export default function RemindersScreen() {
  const { profile } = useUser();
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, enabled: !reminder.enabled }
        : reminder
    ));
  };

  const deleteReminder = (id: string) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => 
          setReminders(reminders.filter(r => r.id !== id))
        }
      ]
    );
  };

  const getTypeColor = (type: Reminder['type']) => {
    switch (type) {
      case 'workout': return Colors.primary;
      case 'meal': return Colors.accent;
      case 'water': return Colors.text;
      case 'sleep': return Colors.textLight;
      default: return Colors.textLight;
    }
  };

  const getTypeIcon = (type: Reminder['type']) => {
    switch (type) {
      case 'workout': return '💪';
      case 'meal': return '🍽️';
      case 'water': return '💧';
      case 'sleep': return '😴';
      default: return '⏰';
    }
  };

  const renderReminder = ({ item }: { item: Reminder }) => (
    <Card style={styles.reminderCard}>
      <View style={styles.reminderHeader}>
        <View style={styles.reminderInfo}>
          <View style={styles.reminderTop}>
            <Text style={[styles.typeIcon, { color: getTypeColor(item.type) }]}>
              {getTypeIcon(item.type)}
            </Text>
            <Text style={styles.reminderTitle}>{item.title}</Text>
            <Switch
              value={item.enabled}
              onValueChange={() => toggleReminder(item.id)}
              trackColor={{ false: Colors.gray, true: getTypeColor(item.type) }}
              thumbColor={Colors.white}
            />
          </View>
          <View style={styles.reminderDetails}>
            <View style={styles.timeContainer}>
              <Clock size={16} color={Colors.textLight} />
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
            <View style={styles.daysContainer}>
              <Calendar size={16} color={Colors.textLight} />
              <Text style={styles.daysText}>{item.days.join(', ')}</Text>
            </View>
          </View>
        </View>
        <View style={styles.reminderActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Edit3 size={16} color={Colors.textLight} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => deleteReminder(item.id)}
          >
            <Trash2 size={16} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reminders</Text>
          <Bell size={24} color={Colors.primary} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Quick Stats */}
          <Card style={styles.statsCard}>
            <Text style={styles.statsTitle}>Today's Schedule</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {reminders.filter(r => r.enabled).length}
                </Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {reminders.filter(r => r.type === 'workout' && r.enabled).length}
                </Text>
                <Text style={styles.statLabel}>Workouts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {reminders.filter(r => r.type === 'meal' && r.enabled).length}
                </Text>
                <Text style={styles.statLabel}>Meals</Text>
              </View>
            </View>
          </Card>

          {/* Add Reminder Button */}
          <TouchableOpacity style={styles.addButton}>
            <Plus size={20} color={Colors.white} />
            <Text style={styles.addButtonText}>Add New Reminder</Text>
          </TouchableOpacity>

          {/* Reminders List */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Reminders</Text>
          </View>

          <View style={styles.remindersList}>
            {reminders.map(reminder => (
              <View key={reminder.id} style={styles.reminderWrapper}>
                {renderReminder({ item: reminder })}
              </View>
            ))}
          </View>

          {/* Quick Add Options */}
          <View style={styles.quickAddSection}>
            <Text style={styles.sectionTitle}>Quick Add</Text>
            <View style={styles.quickAddGrid}>
              <TouchableOpacity style={styles.quickAddButton}>
                <Text style={styles.quickAddIcon}>💪</Text>
                <Text style={styles.quickAddText}>Workout</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAddButton}>
                <Text style={styles.quickAddIcon}>🍽️</Text>
                <Text style={styles.quickAddText}>Meal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAddButton}>
                <Text style={styles.quickAddIcon}>💧</Text>
                <Text style={styles.quickAddText}>Water</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAddButton}>
                <Text style={styles.quickAddIcon}>😴</Text>
                <Text style={styles.quickAddText}>Sleep</Text>
              </TouchableOpacity>
            </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  statsCard: {
    marginBottom: 24,
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
  statItem: {
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.white,
    marginLeft: 8,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  remindersList: {
    gap: 16,
    marginBottom: 32,
  },
  reminderWrapper: {
    marginBottom: 16,
  },
  reminderCard: {
    padding: 20,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    flex: 1,
  },
  reminderDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  timeText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 6,
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  daysText: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 6,
  },
  reminderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  quickAddSection: {
    marginBottom: 16,
  },
  quickAddGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  quickAddButton: {
    width: '48%',
    backgroundColor: Colors.white,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.gray,
  },
  quickAddIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickAddText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
});