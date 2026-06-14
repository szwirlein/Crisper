import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RecipesListScreen } from '../screens/RecipesListScreen';
import { RecipeDetailScreen } from '../screens/RecipeDetailScreen';
import { RecipesStackParamList } from './types';

const Stack = createNativeStackNavigator<RecipesStackParamList>();

export function RecipesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RecipesList" component={RecipesListScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
  );
}
