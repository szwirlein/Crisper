import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useShoppingList } from '../context/ShoppingListContext';
import { ShoppingItem } from '../types';
import { AccentBar } from '../components/AccentBar';
import { colors, radius, spacing, typography } from '../theme';

const MAX_ITEM_LENGTH = 100;

export function ShoppingListScreen() {
  const { items, uncheckedCount, addItem, toggleItem, clearBought } = useShoppingList();
  const [draft, setDraft] = useState('');
  const insets = useSafeAreaInsets();

  const sections = useMemo(() => {
    const unchecked = items.filter((i) => !i.checked);
    const checked = items.filter((i) => i.checked);
    return [
      { key: 'to-buy', title: 'To buy', data: unchecked },
      { key: 'in-basket', title: 'In basket', data: checked },
    ].filter((s) => s.data.length > 0);
  }, [items]);

  const checkedCount = items.length - uncheckedCount;

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
        {item.checked ? <Ionicons name="checkmark" size={15} color={colors.accentText} /> : null}
      </View>
      <Text style={[styles.itemText, item.checked && styles.itemTextChecked]}>{item.text}</Text>
    </Pressable>
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top}
    >
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Shopping{'\n'}List</Text>
              {uncheckedCount > 0 ? (
                <View style={styles.counter}>
                  <Text style={styles.counterValue}>{uncheckedCount}</Text>
                  <Text style={styles.counterLabel}>Remaining</Text>
                </View>
              ) : (
                <View style={styles.statusBadge}>
                  <Ionicons
                    name={items.length === 0 ? 'cart-outline' : 'checkmark-circle'}
                    size={15}
                    color={colors.accent}
                  />
                  <Text style={styles.statusText}>
                    {items.length === 0 ? 'Empty list' : 'Fully stocked'}
                  </Text>
                </View>
              )}
            </View>
            <AccentBar />
          </View>
        }
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionLabel}>{section.title}</Text>
        )}
        renderSectionFooter={({ section }) =>
          section.key === 'in-basket' && checkedCount > 0 ? (
            <Pressable
              onPress={clearBought}
              style={({ pressed }) => [styles.clearBtn, pressed && styles.rowPressed]}
              hitSlop={6}
            >
              <Text style={styles.clearBtnText}>Clear bought ({checkedCount})</Text>
            </Pressable>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Your list is empty</Text>
            <Text style={styles.emptyBody}>
              Add an item below, or pull ingredients in from the Recipes tab.
            </Text>
          </View>
        }
      />

      <View style={[styles.inputBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }]}>
        <View style={styles.inputWrap}>
          <Ionicons name="add" size={18} color={colors.textDisabled} />
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder="Add an item…"
            placeholderTextColor={colors.textDisabled}
            returnKeyType="done"
            maxLength={MAX_ITEM_LENGTH}
            onSubmitEditing={handleAdd}
          />
        </View>
        <Pressable
          onPress={handleAdd}
          disabled={!draft.trim()}
          style={({ pressed }) => [
            styles.addBtn,
            !draft.trim() && styles.addBtnDisabled,
            pressed && draft.trim() && styles.addBtnPressed,
          ]}
        >
          <Ionicons name="add" size={22} color={colors.accentText} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  listContent: { paddingHorizontal: spacing.screenX, flexGrow: 1 },
  header: { paddingBottom: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  title: { ...typography.title },
  counter: { alignItems: 'flex-end', paddingTop: 6 },
  counterValue: { ...typography.counter },
  counterLabel: { ...typography.label, marginTop: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(78, 124, 95, 0.1)',
  },
  statusText: { fontSize: 13, fontWeight: '600', color: colors.accent },
  sectionLabel: { ...typography.label, marginTop: 20, marginBottom: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowPressed: { opacity: 0.55 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.checkboxBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: colors.accent, borderColor: colors.accent },
  itemText: { ...typography.body, flex: 1 },
  itemTextChecked: { textDecorationLine: 'line-through', color: colors.textDisabled },
  clearBtn: { paddingVertical: 16 },
  clearBtnText: { fontSize: 14, fontWeight: '600', color: colors.accent },
  empty: { alignItems: 'center', paddingTop: 64, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 },
  emptyBody: { fontSize: 15, color: colors.textMuted, textAlign: 'center', lineHeight: 21 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.screenX,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.inputBackground,
    borderRadius: radius.input,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: { flex: 1, fontSize: 15, color: colors.text, padding: 0 },
  addBtn: {
    width: 46,
    height: 46,
    borderRadius: radius.input,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnPressed: { opacity: 0.85 },
  addBtnDisabled: { backgroundColor: '#bcd0c3' },
});
