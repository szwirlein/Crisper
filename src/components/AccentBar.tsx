import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';

// The short moss-green accent rule that sits under each screen title,
// trailing off into a full-width hairline.
export function AccentBar() {
  return (
    <View style={styles.row}>
      <View style={styles.accent} />
      <View style={styles.hairline} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 16 },
  accent: {
    width: 110,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
  hairline: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
});
