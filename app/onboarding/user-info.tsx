import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Colors from '../../constants/colors';
import { Gender, FitnessLevel } from '../../types/user';
import { useUser } from '../../contexts/UserContext';

export default function UserInfoScreen() {
  const router = useRouter();
  const { updateProfile } = useUser();
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<Gender | undefined>(undefined);
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel | undefined>(undefined);

  const genderOptions: { label: string; value: Gender }[] = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
    { label: 'Prefer not to say', value: 'prefer_not_to_say' },
  ];

  const fitnessLevelOptions: { label: string; value: FitnessLevel; desc: string }[] = [
    { label: 'Beginner', value: 'beginner', desc: 'Just starting out' },
    { label: 'Intermediate', value: 'intermediate', desc: 'Some experience' },
    { label: 'Advanced', value: 'advanced', desc: 'Regular workouts' },
  ];

  const handleNext = async () => {
    await updateProfile({
      name,
      age: age ? parseInt(age) : undefined,
      gender,
      height: height ? parseFloat(height) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      fitnessLevel,
    });
    router.push('/onboarding/goals');
  };

  const isValid = name.trim().length > 0;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.step}>Step 1 of 2</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Tell us about yourself</Text>
          <Text style={styles.subtitle}>Help us personalize your experience</Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  value={age}
                  onChangeText={setAge}
                  placeholder="25"
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textLight}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Height (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={height}
                  onChangeText={setHeight}
                  placeholder="170"
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textLight}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="70"
                keyboardType="numeric"
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.optionsGrid}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      gender === option.value && styles.optionSelected,
                    ]}
                    onPress={() => setGender(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        gender === option.value && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fitness Level</Text>
              <View style={styles.levelOptions}>
                {fitnessLevelOptions.map((option) => (
                  <Card
                    key={option.value}
                    style={[
                      styles.levelCard,
                      fitnessLevel === option.value && styles.levelCardSelected,
                    ]}
                    onPress={() => setFitnessLevel(option.value)}
                  >
                    <Text
                      style={[
                        styles.levelTitle,
                        fitnessLevel === option.value && styles.levelTitleSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text style={styles.levelDesc}>{option.desc}</Text>
                  </Card>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button title="Next" onPress={handleNext} disabled={!isValid} />
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
  form: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  row: {
    flexDirection: 'row',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: Colors.gray,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  optionText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  optionTextSelected: {
    color: Colors.primaryDark,
    fontWeight: '600' as const,
  },
  levelOptions: {
    gap: 12,
  },
  levelCard: {
    borderWidth: 2,
    borderColor: 'transparent',
  },
  levelCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  levelTitleSelected: {
    color: Colors.primaryDark,
  },
  levelDesc: {
    fontSize: 14,
    color: Colors.textLight,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: Colors.white,
  },
});
