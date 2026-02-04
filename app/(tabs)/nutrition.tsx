import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, Apple, Beef, Milk, Wheat } from 'lucide-react-native';
import Card from '../../components/Card';
import Colors from '../../constants/colors';
import { useUser } from '../../contexts/UserContext';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: 'fruit' | 'vegetable' | 'protein' | 'dairy' | 'grain' | 'other';
}

const mockFoodItems: FoodItem[] = [
  { id: '1', name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, category: 'fruit' },
  { id: '2', name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, category: 'protein' },
  { id: '3', name: 'Greek Yogurt', calories: 100, protein: 10, carbs: 6, fat: 0.7, category: 'dairy' },
  { id: '4', name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 1.8, category: 'grain' },
  { id: '5', name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, category: 'vegetable' },
];

export default function NutritionScreen() {
  const { profile } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [dailyCalories, setDailyCalories] = useState(0);
  const [dailyProtein, setDailyProtein] = useState(0);
  const [dailyCarbs, setDailyCarbs] = useState(0);
  const [dailyFat, setDailyFat] = useState(0);

  const filteredFoods = mockFoodItems.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIconForCategory = (category: FoodItem['category']) => {
    switch (category) {
      case 'fruit': return <Apple size={24} color={Colors.primary} />;
      case 'protein': return <Beef size={24} color={Colors.accent} />;
      case 'dairy': return <Milk size={24} color={Colors.text} />;
      case 'grain': return <Wheat size={24} color={Colors.textLight} />;
      default: return <Apple size={24} color={Colors.text} />;
    }
  };

  const addFoodToDay = (food: FoodItem) => {
    setDailyCalories(prev => prev + food.calories);
    setDailyProtein(prev => prev + food.protein);
    setDailyCarbs(prev => prev + food.carbs);
    setDailyFat(prev => prev + food.fat);
    Alert.alert('Added!', `${food.name} added to today's nutrition`);
  };

  const getCalorieGoal = () => {
    // Simple calculation based on user profile
    return profile.weight ? profile.weight * 15 : 2000;
  };

  const getProteinGoal = () => {
    return profile.weight ? profile.weight * 2 : 150;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nutrition</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Daily Summary */}
          <Card style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Today's Nutrition</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{dailyCalories}</Text>
                <Text style={styles.nutritionLabel}>Calories</Text>
                <Text style={styles.nutritionGoal}>Goal: {getCalorieGoal()}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{dailyProtein}g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
                <Text style={styles.nutritionGoal}>Goal: {getProteinGoal()}g</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{dailyCarbs}g</Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
                <Text style={styles.nutritionGoal}>Goal: 250g</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{dailyFat}g</Text>
                <Text style={styles.nutritionLabel}>Fat</Text>
                <Text style={styles.nutritionGoal}>Goal: 70g</Text>
              </View>
            </View>
          </Card>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search size={20} color={Colors.textLight} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search foods..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.textLight}
            />
          </View>

          {/* Food Categories */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Food Database</Text>
          </View>

          <View style={styles.foodList}>
            {filteredFoods.map((food) => (
              <Card key={food.id} style={styles.foodCard}>
                <View style={styles.foodHeader}>
                  {getIconForCategory(food.category)}
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.foodCalories}>{food.calories} cal</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.addFoodButton}
                    onPress={() => addFoodToDay(food)}
                  >
                    <Plus size={16} color={Colors.white} />
                  </TouchableOpacity>
                </View>
                <View style={styles.nutritionDetails}>
                  <Text style={styles.nutritionDetail}>P: {food.protein}g</Text>
                  <Text style={styles.nutritionDetail}>C: {food.carbs}g</Text>
                  <Text style={styles.nutritionDetail}>F: {food.fat}g</Text>
                </View>
              </Card>
            ))}
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  summaryCard: {
    marginBottom: 24,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: Colors.text,
    marginBottom: 2,
  },
  nutritionGoal: {
    fontSize: 10,
    color: Colors.textLight,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  foodList: {
    gap: 12,
  },
  foodCard: {
    padding: 16,
  },
  foodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  foodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  foodCalories: {
    fontSize: 14,
    color: Colors.textLight,
  },
  addFoodButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nutritionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nutritionDetail: {
    fontSize: 12,
    color: Colors.textLight,
  },
});