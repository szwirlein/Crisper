import React, { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShoppingList } from '../context/ShoppingListContext';
import { ShoppingItem } from '../types';

const MAX_ITEM_LENGTH = 100;

export function ShoppingListScreen() {
  const { items, addItem, toggleItem, clearBought } = useShoppingList();
  const [draft, setDraft] = useState('');
  const insets = useSafeAreaInsets();

  // Unchecked stay in insertion order at the top; checked sink to the bottom.
  const ordered = useMemo(() => {
    const unchecked = items.filter((i) => !i.checked);
    const checked = items.filter((i) => i.checked);
    return [...unchecked, ...checked];
  }, [items]);

  const checkedCount = items.length - ordered.filter((i) => !i.checked).length;

  const handleAdd = () => {
    if (!draft.trim()) return;
    addItem(draft);
    setDraft('');
  };

  const renderItem = ({ item }: { item: ShoppingItem }) => (
    <Pressable
      onPress={() => toggleItem(item.id)}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
        {item.checked ? <Text style={styles.checkmark}>✓</Text> : null}
      </View>
      <Text style={[styles.itemText, item.checked && styles.itemTextChecked]}>
        {item.text}
      </Text>
    </Pressable>
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top + 44}
    >
      <View style={styles.flex}>
        <FlatList
          data={ordered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Your list is empty</Text>
              <Text style={styles.emptyBody}>
                Add an item below, or pull ingredients in from the Recipes tab.
              </Text>
            </View>
          }
          keyboardShouldPersistTaps="handled"
        />

        {checkedCount > 0 ? (
          <View style={styles.clearWrap}>
            <Pressable
              onPress={clearBought}
              style={({ pressed }) => [styles.clearBtn, pressed && styles.clearBtnPressed]}
            >
              <Text style={styles.clearBtnText}>
                Clear bought ({checkedCount})
              </Text>
            </Pressable>
          </View>
        ) : null}

        <View style={[styles.inputBar, { paddingBottom: insets.bottom > 0 ? 8 : 12 }]}>
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder="Add an item…"
            placeholderTextColor="#9aa0a6"
            returnKeyType="done"
            maxLength={MAX_ITEM_LENGTH}
            onSubmitEditing={handleAdd}
          />
          <Pressable
            onPress={handleAdd}
            disabled={!draft.trim()}
            style={({ pressed }) => [
              styles.addBtn,
              !draft.trim() && styles.addBtnDisabled,
              pressed && draft.trim() && styles.addBtnPressed,
            ]}
          >
            <Text style={styles.addBtnText}>Add</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f2f2f7' },
  listContent: { paddingVertical: 8, flexGrow: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
  },
  rowPressed: { backgroundColor: '#ececf1' },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#c4c4c9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkboxChecked: { backgroundColor: '#34c759', borderColor: '#34c759' },
  checkmark: { color: '#fff', fontSize: 15, fontWeight: '800', lineHeight: 18 },
  itemText: { fontSize: 17, color: '#1c1c1e', flexShrink: 1 },
  itemTextChecked: {
    textDecorationLine: 'line-through',
    color: '#b0b0b5',
  },
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#3c3c43', marginBottom: 8 },
  emptyBody: { fontSize: 15, color: '#8e8e93', textAlign: 'center', lineHeight: 21 },
  clearWrap: { paddingHorizontal: 12, paddingBottom: 6 },
  clearBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  clearBtnPressed: { backgroundColor: '#ececf1' },
  clearBtnText: { color: '#ff3b30', fontSize: 16, fontWeight: '600' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#d1d1d6',
    backgroundColor: '#f9f9fb',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
    color: '#1c1c1e',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#d1d1d6',
  },
  addBtn: {
    marginLeft: 10,
    backgroundColor: '#007aff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  addBtnPressed: { backgroundColor: '#0066d6' },
  addBtnDisabled: { backgroundColor: '#b9d6ff' },
  addBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
