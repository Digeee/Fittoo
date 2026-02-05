import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../contexts/UserContext';
import Colors from '../constants/colors';

export default function IndexScreen() {
  const router = useRouter();
  const { profile, isLoading, isAuthenticated } = useUser();

  useEffect(() => {
    if (!isLoading) {
      // If user is authenticated, redirect based on onboarding status
      if (isAuthenticated) {
        if (profile.onboarded) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/onboarding/welcome');
        }
      } else {
        // If not authenticated, redirect to login
        router.replace('/(auth)/login');
      }
    }
  }, [isLoading, profile.onboarded, isAuthenticated, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
});
