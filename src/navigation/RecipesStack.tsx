import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RecipesListScreen } from '../screens/RecipesListScreen';
import { RecipeDetailScreen } from '../screens/RecipeDetailScreen';
import { RecipesStackParamList } from './types';

const Stack = createNativeStackNavigator<RecipesStackParamList>();

export function RecipesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RecipesList"
        component={RecipesListScreen}
        options={{ title: 'Recipes' }}
      />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{ title: '', headerBackTitle: 'Recipes' }}
      />
    </Stack.Navigator>
  );
}
