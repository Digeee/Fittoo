import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../contexts/UserContext'; // Using relative path

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // If requiring auth and user is not authenticated
    if (requireAuth && !isAuthenticated) {
      router.replace('/(auth)/login');
    }
    // If not requiring auth (public route) and user is authenticated, redirect away from login
    else if (!requireAuth && isAuthenticated) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isLoading, router, requireAuth]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7FD87F" />
      </View>
    );
  }

  // Show children if authentication state allows it
  if ((requireAuth && isAuthenticated) || (!requireAuth && !isAuthenticated)) {
    return <>{children}</>;
  }

  // Show loading while redirecting
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#7FD87F" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
});