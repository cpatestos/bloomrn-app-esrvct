
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

export default function MediaQuickStart() {
  const router = useRouter();

  return (
    <View style={commonStyles.card}>
      <Text style={commonStyles.heading}>🎙️ Media Recording</Text>
      <Text style={commonStyles.textSecondary}>
        Record audio reflections or video journals
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[buttonStyles.outline, styles.button]}
          onPress={() => router.push('/media/record-media')}
        >
          <Text style={styles.buttonIcon}>🎤</Text>
          <Text style={buttonStyles.text}>Record</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[buttonStyles.outline, styles.button]}
          onPress={() => router.push('/media/view-recordings')}
        >
          <Text style={styles.buttonIcon}>📁</Text>
          <Text style={buttonStyles.text}>View</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          ✓ Secure cloud storage{'\n'}
          ✓ Private and encrypted{'\n'}
          ✓ Easy playback and management
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  infoBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: `${colors.primary}10`,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  infoText: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
  },
});
