import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function Toast({ message }: { message: string | null }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: message ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [message, opacity]);

  // Keep mounted so the fade-out animation can play; ignore taps when hidden.
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, { opacity, bottom: insets.bottom + 90 }]}
    >
      {message ? (
        <Text style={styles.text} numberOfLines={2}>
          {message}
        </Text>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  text: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 22,
    overflow: 'hidden',
    maxWidth: '85%',
    textAlign: 'center',
  },
});
