import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RECIPES } from '../data/recipes';
import { useShoppingList } from '../context/ShoppingListContext';
import { RecipesStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RecipesStackParamList, 'RecipeDetail'>;

export function RecipeDetailScreen({ route }: Props) {
  const { recipeId } = route.params;
  const recipe = RECIPES.find((r) => r.id === recipeId);
  const { addItems, showToast } = useShoppingList();
  const insets = useSafeAreaInsets();

  if (!recipe) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Recipe not found.</Text>
      </View>
    );
  }

  const handleAdd = () => {
    addItems(recipe.ingredients);
    const n = recipe.ingredients.length;
    showToast(`${n} item${n === 1 ? '' : 's'} added to your list`);
  };

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
    >
      <Text style={styles.title}>{recipe.name}</Text>

      <Text style={styles.sectionHeader}>Ingredients</Text>
      <View style={styles.card}>
        {recipe.ingredients.map((ing, i) => (
          <View
            key={`${recipe.id}-ing-${i}`}
            style={[styles.ingredientRow, i > 0 && styles.divider]}
          >
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.ingredientText}>{ing}</Text>
          </View>
        ))}
      </View>

      {recipe.instructions && recipe.instructions.length > 0 ? (
        <>
          <Text style={styles.sectionHeader}>Instructions</Text>
          <View style={styles.card}>
            {recipe.instructions.map((step, i) => (
              <View
                key={`${recipe.id}-step-${i}`}
                style={[styles.stepRow, i > 0 && styles.divider]}
              >
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}

      <Pressable
        onPress={handleAdd}
        style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
      >
        <Text style={styles.addBtnText}>Add to shopping list</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f2f2f7' },
  content: { padding: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#1c1c1e', marginBottom: 8 },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8e8e93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16 },
  ingredientRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12 },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#e2e2e7' },
  bullet: { fontSize: 17, color: '#34c759', marginRight: 12, lineHeight: 23 },
  ingredientText: { fontSize: 17, color: '#1c1c1e', flexShrink: 1, lineHeight: 23 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 14 },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#007aff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 1,
  },
  stepNumberText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  stepText: { fontSize: 17, color: '#1c1c1e', flexShrink: 1, lineHeight: 24 },
  addBtn: {
    marginTop: 28,
    backgroundColor: '#007aff',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  addBtnPressed: { backgroundColor: '#0066d6' },
  addBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missingText: { fontSize: 16, color: '#8e8e93' },
});
