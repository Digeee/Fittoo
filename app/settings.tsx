import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Bell, Shield, Palette, HelpCircle, Info, LogOut, Moon, Sun, User, Mail, Lock } from 'lucide-react-native';
import Card from '../components/Card';
import Colors from '../constants/colors';
import { useUser } from '../contexts/UserContext';

export default function SettingsScreen() {
  const { profile, updateProfile } = useUser();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [workoutReminders, setWorkoutReminders] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout pressed') }
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { 
          icon: User, 
          label: 'Profile Information', 
          value: profile.name || 'Not set',
          action: () => console.log('Edit profile')
        },
        { 
          icon: Mail, 
          label: 'Email Address', 
          value: 'user@example.com',
          action: () => console.log('Change email')
        },
        { 
          icon: Lock, 
          label: 'Change Password', 
          value: '',
          action: () => console.log('Change password')
        }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { 
          icon: Bell, 
          label: 'Push Notifications', 
          value: '',
          action: () => setNotifications(!notifications),
          switch: true,
          switchValue: notifications
        },
        { 
          icon: Mail, 
          label: 'Email Notifications', 
          value: '',
          action: () => setEmailNotifications(!emailNotifications),
          switch: true,
          switchValue: emailNotifications
        },
        { 
          icon: Bell, 
          label: 'Workout Reminders', 
          value: '',
          action: () => setWorkoutReminders(!workoutReminders),
          switch: true,
          switchValue: workoutReminders
        },
        { 
          icon: darkMode ? Sun : Moon, 
          label: darkMode ? 'Light Mode' : 'Dark Mode', 
          value: '',
          action: () => setDarkMode(!darkMode),
          switch: true,
          switchValue: darkMode
        }
      ]
    },
    {
      title: 'Security',
      items: [
        { 
          icon: Shield, 
          label: 'Privacy Policy', 
          value: '',
          action: () => console.log('Privacy policy')
        },
        { 
          icon: Shield, 
          label: 'Terms of Service', 
          value: '',
          action: () => console.log('Terms of service')
        }
      ]
    },
    {
      title: 'Support',
      items: [
        { 
          icon: HelpCircle, 
          label: 'Help Center', 
          value: '',
          action: () => console.log('Help center')
        },
        { 
          icon: Info, 
          label: 'About', 
          value: 'Version 1.0.0',
          action: () => console.log('About')
        }
      ]
    }
  ];

  const renderSettingItem = (item: any) => (
    <TouchableOpacity
      key={item.label}
      style={styles.settingItem}
      onPress={item.action}
      disabled={item.switch}
    >
      <View style={styles.settingLeft}>
        <item.icon size={20} color={Colors.text} />
        <Text style={styles.settingLabel}>{item.label}</Text>
      </View>
      <View style={styles.settingRight}>
        {item.value ? (
          <Text style={styles.settingValue}>{item.value}</Text>
        ) : item.switch ? (
          <Switch
            value={item.switchValue}
            onValueChange={item.action}
            trackColor={{ false: Colors.gray, true: Colors.primary }}
            thumbColor={Colors.white}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Settings size={24} color={Colors.primary} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* User Profile Section */}
          <Card style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.profileAvatar}>
                <User size={32} color={Colors.white} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profile.name || 'Fitness Enthusiast'}</Text>
                <Text style={styles.profileEmail}>user@example.com</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </Card>

          {/* Settings Sections */}
          {settingsSections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Card style={styles.settingsCard}>
                {section.items.map(renderSettingItem)}
              </Card>
            </View>
          ))}

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appName}>FitGoals</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.copyright}>© 2026 FitGoals. All rights reserved.</Text>
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
    paddingBottom: 48,
  },
  profileCard: {
    marginBottom: 32,
    padding: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.textLight,
  },
  editProfileButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.primary + '20',
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
    marginLeft: 8,
  },
  settingsCard: {
    padding: 0,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 16,
  },
  settingRight: {
    alignItems: 'flex-end',
  },
  settingValue: {
    fontSize: 14,
    color: Colors.textLight,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: Colors.error + '30',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.error,
    marginLeft: 12,
  },
  appInfo: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.gray,
  },
  appName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 8,
  },
  copyright: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
});