
import { StyleSheet } from 'react-native';

// Calming blues and greens color palette with botanical theme
export const colors = {
  // Primary colors - calming blues
  primaryLight: '#B3E5FC',    // Light sky blue
  primary: '#4FC3F7',          // Bright blue
  primaryDark: '#0288D1',      // Deep blue
  
  // Secondary colors - soothing greens
  secondaryLight: '#C8E6C9',   // Light mint green
  secondary: '#66BB6A',        // Fresh green
  secondaryDark: '#388E3C',    // Deep green
  
  // Botanical accents
  leafGreen: '#81C784',        // Soft leaf green
  mintFresh: '#A5D6A7',        // Fresh mint
  oceanBlue: '#4DD0E1',        // Ocean blue
  
  // Neutral colors
  background: '#F0F8FF',       // Alice blue (very light blue)
  backgroundAlt: '#E8F5E9',    // Very light green
  card: '#FFFFFF',             // White
  
  // Text colors
  text: '#1B5E20',             // Dark green
  textSecondary: '#546E7A',    // Blue grey
  textLight: '#78909C',        // Light blue grey
  
  // Accent colors
  accent: '#80DEEA',           // Cyan
  highlight: '#E0F7FA',        // Very light cyan
  
  // Status colors
  success: '#66BB6A',          // Green
  warning: '#FFA726',          // Orange
  error: '#EF5350',            // Red
  info: '#42A5F5',             // Blue
  
  // UI elements
  border: '#B0BEC5',           // Grey blue
  divider: '#CFD8DC',          // Light grey
  shadow: 'rgba(0, 0, 0, 0.1)',
  
  // Dark mode colors
  darkBackground: '#1A1A1A',
  darkCard: '#2C2C2C',
  darkText: '#C8E6C9',
  darkTextSecondary: '#90A4AE',
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(79, 195, 247, 0.3)',
    elevation: 4,
  },
  secondary: {
    backgroundColor: colors.secondary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(102, 187, 106, 0.3)',
    elevation: 4,
  },
  outline: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  textLight: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 120,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  textLight: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textLight,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  cardSmall: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  section: {
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  botanicalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
});
