import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RECIPES } from '../data/recipes';
import { useShoppingList } from '../context/ShoppingListContext';
import { RecipesStackParamList } from '../navigation/types';
import { AccentBar } from '../components/AccentBar';
import { colors, radius, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RecipesStackParamList, 'RecipeDetail'>;

export function RecipeDetailScreen({ route, navigation }: Props) {
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

  const stepCount = recipe.instructions?.length ?? 0;

  const handleAdd = () => {
    addItems(recipe.ingredients);
    const n = recipe.ingredients.length;
    showToast(`${n} item${n === 1 ? '' : 's'} added to your list`);
  };

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 28 }]}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.back,
            { marginTop: insets.top + 4 },
            pressed && styles.pressed,
          ]}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={20} color={colors.accent} />
          <Text style={styles.backText}>Recipes</Text>
        </Pressable>

        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.headerMeta}>
          {recipe.ingredients.length} Ingredients
          {stepCount > 0 ? ` \u00b7 ${stepCount} Steps` : ''}
        </Text>
        <AccentBar />

        <Text style={styles.sectionLabel}>Ingredients</Text>
        <View>
          {recipe.ingredients.map((ing, i) => (
            <View key={`${recipe.id}-ing-${i}`} style={styles.ingredientRow}>
              <View style={styles.dot} />
              <Text style={styles.ingredientText}>{ing}</Text>
            </View>
          ))}
        </View>

        {stepCount > 0 ? (
          <>
            <Text style={styles.sectionLabel}>Instructions</Text>
            <View>
              {recipe.instructions!.map((step, i) => (
                <View key={`${recipe.id}-step-${i}`} style={styles.stepRow}>
                  <Text style={styles.stepNumber}>{String(i + 1).padStart(2, '0')}</Text>
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
          <Ionicons name="add" size={20} color={colors.accentText} />
          <Text style={styles.addBtnText}>Add to shopping list</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.screenX },
  pressed: { opacity: 0.55 },
  back: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingVertical: 6 },
  backText: { fontSize: 16, fontWeight: '600', color: colors.accent, marginLeft: 2 },
  title: { ...typography.title, marginTop: 4 },
  headerMeta: { ...typography.label, marginTop: 12 },
  sectionLabel: { ...typography.label, marginTop: 24, marginBottom: 4 },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent },
  ingredientText: { ...typography.body, flex: 1, lineHeight: 20 },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  stepNumber: { fontSize: 16, fontWeight: '700', color: colors.accent, lineHeight: 24, width: 24 },
  stepText: { ...typography.body, flex: 1, lineHeight: 24 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 28,
    backgroundColor: colors.accent,
    paddingVertical: 17,
    borderRadius: radius.button,
  },
  addBtnPressed: { opacity: 0.85 },
  addBtnText: { color: colors.accentText, fontSize: 16, fontWeight: '600' },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  missingText: { fontSize: 16, color: colors.textMuted },
});
