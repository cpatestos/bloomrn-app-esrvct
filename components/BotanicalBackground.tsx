
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

export default function BotanicalBackground() {
  return (
    <View style={styles.container}>
      <View style={[styles.leaf, styles.leaf1]} />
      <View style={[styles.leaf, styles.leaf2]} />
      <View style={[styles.leaf, styles.leaf3]} />
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
    pointerEvents: 'none',
  },
  leaf: {
    position: 'absolute',
    backgroundColor: colors.leafGreen,
    borderRadius: 100,
  },
  leaf1: {
    width: 200,
    height: 200,
    top: 50,
    right: -50,
    transform: [{ rotate: '45deg' }],
  },
  leaf2: {
    width: 150,
    height: 150,
    bottom: 100,
    left: -30,
    transform: [{ rotate: '-30deg' }],
  },
  leaf3: {
    width: 120,
    height: 120,
    top: '40%',
    left: '70%',
    transform: [{ rotate: '60deg' }],
  },
  circle: {
    position: 'absolute',
    backgroundColor: colors.oceanBlue,
    borderRadius: 1000,
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    left: -100,
  },
  circle2: {
    width: 250,
    height: 250,
    bottom: -80,
    right: -80,
  },
});
