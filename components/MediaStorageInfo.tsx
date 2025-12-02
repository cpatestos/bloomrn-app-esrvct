
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { mediaService } from '@/services/mediaService';

export default function MediaStorageInfo() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRecordings: 0,
    audioCount: 0,
    videoCount: 0,
    totalSize: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const recordings = await mediaService.getMediaRecordings();
      
      const audioCount = recordings.filter(r => r.mediaType === 'audio').length;
      const videoCount = recordings.filter(r => r.mediaType === 'video').length;
      const totalSize = recordings.reduce((sum, r) => sum + (r.fileSizeBytes || 0), 0);

      setStats({
        totalRecordings: recordings.length,
        audioCount,
        videoCount,
        totalSize,
      });
    } catch (error) {
      console.error('Error loading storage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 MB';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      const kb = bytes / 1024;
      return `${kb.toFixed(1)} KB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  if (loading) {
    return (
      <View style={commonStyles.card}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={commonStyles.card}>
      <Text style={commonStyles.heading}>📊 Storage Overview</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalRecordings}</Text>
          <Text style={styles.statLabel}>Total Recordings</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.audioCount}</Text>
          <Text style={styles.statLabel}>Audio Files</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.videoCount}</Text>
          <Text style={styles.statLabel}>Video Files</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatSize(stats.totalSize)}</Text>
          <Text style={styles.statLabel}>Total Size</Text>
        </View>
      </View>

      {stats.totalRecordings === 0 && (
        <View style={styles.emptyState}>
          <Text style={commonStyles.textSecondary}>
            No recordings yet. Start recording to see your storage stats.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: `${colors.primary}10`,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  emptyState: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
  },
});
