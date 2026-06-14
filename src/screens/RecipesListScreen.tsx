import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RECIPES } from '../data/recipes';
import { RecipesStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RecipesStackParamList, 'RecipesList'>;

export function RecipesListScreen({ navigation }: Props) {
  return (
    <FlatList
      style={styles.flex}
      contentContainerStyle={styles.content}
      data={RECIPES}
      keyExtractor={(r) => r.id}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
        >
          <View style={styles.rowText}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.ingredients.length} ingredients</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f2f2f7' },
  content: { paddingVertical: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
  },
  rowPressed: { backgroundColor: '#ececf1' },
  rowText: { flex: 1 },
  name: { fontSize: 17, fontWeight: '600', color: '#1c1c1e' },
  meta: { fontSize: 14, color: '#8e8e93', marginTop: 3 },
  chevron: { fontSize: 26, color: '#c4c4c9', marginLeft: 12 },
});
