import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, Settings, LogOut, Calendar, Flame, Target } from 'lucide-react-native';
import { useUser } from '../../contexts/UserContext'; // Using relative path
import Colors from '../../constants/colors'; // Using relative path

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, logout, getStreakDays, getTodayStats } = useUser();
  
  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            logout();
            // Using a route that exists in the router
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const todayStats = getTodayStats();
  const streakDays = getStreakDays();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
          >
            <Settings size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User size={40} color={Colors.white} />
              </View>
            </View>
            <Text style={styles.profileName}>{profile.name || 'Fitness Enthusiast'}</Text>
            <Text style={styles.profileSubtitle}>{profile.email || 'No email added'}</Text>
          </View>

          {/* Stats Overview */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Flame size={24} color={Colors.white} />
              </View>
              <Text style={styles.statNumber}>{streakDays}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Target size={24} color={Colors.white} />
              </View>
              <Text style={styles.statNumber}>{todayStats.workoutsCompleted}</Text>
              <Text style={styles.statLabel}>Workouts Today</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Calendar size={24} color={Colors.white} />
              </View>
              <Text style={styles.statNumber}>{todayStats.caloriesBurned}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
          </View>

          {/* Profile Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/settings')}
            >
              <Settings size={20} color={Colors.text} />
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <LogOut size={20} color={Colors.error} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
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
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
  actionsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.grayLight,
    marginBottom: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.error + '20',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginLeft: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.error,
    marginLeft: 12,
  },
});