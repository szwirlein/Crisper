import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ShoppingListProvider, useShoppingList } from './src/context/ShoppingListContext';
import { RecipesStack } from './src/navigation/RecipesStack';
import { ShoppingListScreen } from './src/screens/ShoppingListScreen';

const Tab = createBottomTabNavigator();

function RootTabs() {
  const { uncheckedCount } = useShoppingList();

  return (
    <Tab.Navigator
      screenOptions={{ tabBarActiveTintColor: '#007aff' }}
    >
      <Tab.Screen
        name="ShoppingListTab"
        component={ShoppingListScreen}
        options={{
          title: 'Shopping List',
          tabBarBadge: uncheckedCount > 0 ? uncheckedCount : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="RecipesTab"
        component={RecipesStack}
        options={{
          title: 'Recipes',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ShoppingListProvider>
        <NavigationContainer>
          <RootTabs />
        </NavigationContainer>
        <StatusBar style="dark" />
      </ShoppingListProvider>
    </SafeAreaProvider>
  );
}
