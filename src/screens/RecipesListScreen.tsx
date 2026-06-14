import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RECIPES } from '../data/recipes';
import { RecipesStackParamList } from '../navigation/types';
import { AccentBar } from '../components/AccentBar';
import { colors, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RecipesStackParamList, 'RecipesList'>;

export function RecipesListScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.flex}>
      <FlatList
        data={RECIPES}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Recipes</Text>
              <View style={styles.counter}>
                <Text style={styles.counterValue}>{RECIPES.length}</Text>
                <Text style={styles.counterLabel}>Recipes</Text>
              </View>
            </View>
            <AccentBar />
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <View style={styles.rowText}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.ingredients.length} ingredients</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.accent} />
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.screenX, paddingBottom: 16 },
  header: { paddingBottom: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  title: { ...typography.title },
  counter: { alignItems: 'flex-end', paddingTop: 6 },
  counterValue: { ...typography.counter },
  counterLabel: { ...typography.label, marginTop: 2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowPressed: { opacity: 0.55 },
  rowText: { flex: 1, gap: 4 },
  name: { ...typography.rowTitle },
  meta: { ...typography.label },
});
