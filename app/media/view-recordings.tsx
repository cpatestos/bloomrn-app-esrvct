
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { mediaService } from '@/services/mediaService';
import { MediaRecording } from '@/types';
import { Audio } from 'expo-av';
import MediaStorageInfo from '@/components/MediaStorageInfo';

export default function ViewRecordingsScreen() {
  const router = useRouter();
  const [recordings, setRecordings] = useState<MediaRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'audio' | 'video'>('all');
  const [playingSound, setPlayingSound] = useState<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    loadRecordings();

    return () => {
      if (playingSound) {
        playingSound.unloadAsync().catch(console.error);
      }
    };
  }, [filter]);

  const loadRecordings = async () => {
    try {
      setLoading(true);
      const mediaType = filter === 'all' ? undefined : filter;
      const data = await mediaService.getMediaRecordings(mediaType);
      setRecordings(data);
    } catch (error) {
      console.error('Error loading recordings:', error);
      Alert.alert('Error', 'Failed to load recordings');
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async (recording: MediaRecording) => {
    try {
      // Stop any currently playing sound
      if (playingSound) {
        await playingSound.unloadAsync();
        setPlayingSound(null);
        setPlayingId(null);
      }

      // Get signed URL
      const url = await mediaService.getMediaUrl('audio-recordings', recording.filePath);
      if (!url) {
        Alert.alert('Error', 'Failed to load audio');
        return;
      }

      // Load and play
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );

      setPlayingSound(sound);
      setPlayingId(recording.id);

      // Auto-cleanup when finished
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(console.error);
          setPlayingSound(null);
          setPlayingId(null);
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Error', 'Failed to play audio');
    }
  };

  const stopAudio = async () => {
    if (playingSound) {
      await playingSound.unloadAsync();
      setPlayingSound(null);
      setPlayingId(null);
    }
  };

  const deleteRecording = async (recording: MediaRecording) => {
    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const bucket = recording.mediaType === 'audio' ? 'audio-recordings' : 'video-recordings';
            const success = await mediaService.deleteMediaRecording(
              recording.id,
              bucket,
              recording.filePath
            );

            if (success) {
              Alert.alert('Success', 'Recording deleted');
              loadRecordings();
            } else {
              Alert.alert('Error', 'Failed to delete recording');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      const kb = bytes / 1024;
      return `${kb.toFixed(1)} KB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={commonStyles.title}>My Recordings</Text>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => router.push('/media/help')}
          >
            <Text style={styles.helpText}>❓</Text>
          </TouchableOpacity>
        </View>
        <Text style={commonStyles.text}>
          View and manage your audio and video recordings
        </Text>
      </View>

      <MediaStorageInfo />

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'audio' && styles.filterButtonActive]}
          onPress={() => setFilter('audio')}
        >
          <Text style={[styles.filterText, filter === 'audio' && styles.filterTextActive]}>
            🎤 Audio
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'video' && styles.filterButtonActive]}
          onPress={() => setFilter('video')}
        >
          <Text style={[styles.filterText, filter === 'video' && styles.filterTextActive]}>
            🎥 Video
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : recordings.length === 0 ? (
        <View style={commonStyles.card}>
          <Text style={commonStyles.textSecondary}>
            No recordings yet. Start recording to see them here.
          </Text>
          <TouchableOpacity
            style={[buttonStyles.primary, { marginTop: 16 }]}
            onPress={() => router.push('/media/record-media')}
          >
            <Text style={[buttonStyles.text, { color: '#FFFFFF' }]}>
              Start Recording
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        recordings.map((recording, index) => (
          <React.Fragment key={index}>
            <View style={commonStyles.card}>
              <View style={styles.recordingHeader}>
                <Text style={styles.recordingIcon}>
                  {recording.mediaType === 'audio' ? '🎤' : '🎥'}
                </Text>
                <View style={styles.recordingInfo}>
                  <Text style={commonStyles.heading}>
                    {recording.title || `${recording.mediaType === 'audio' ? 'Audio' : 'Video'} Recording`}
                  </Text>
                  <Text style={styles.recordingDate}>
                    {formatDate(recording.createdAt)}
                  </Text>
                </View>
              </View>

              {recording.description && (
                <Text style={[commonStyles.text, { marginTop: 8 }]}>
                  {recording.description}
                </Text>
              )}

              <View style={styles.recordingMeta}>
                <Text style={styles.metaText}>
                  Duration: {formatDuration(recording.durationSeconds)}
                </Text>
                <Text style={styles.metaText}>
                  Size: {formatFileSize(recording.fileSizeBytes)}
                </Text>
              </View>

              <View style={styles.actionButtons}>
                {recording.mediaType === 'audio' && (
                  <TouchableOpacity
                    style={[buttonStyles.outline, styles.actionButton]}
                    onPress={() => {
                      if (playingId === recording.id) {
                        stopAudio();
                      } else {
                        playAudio(recording);
                      }
                    }}
                  >
                    <Text style={buttonStyles.text}>
                      {playingId === recording.id ? '⏹ Stop' : '▶️ Play'}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[buttonStyles.outline, styles.actionButton, styles.deleteButton]}
                  onPress={() => deleteRecording(recording)}
                >
                  <Text style={[buttonStyles.text, { color: '#FF3B30' }]}>
                    🗑️ Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </React.Fragment>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  helpButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpText: {
    fontSize: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  filterButtonActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}15`,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  filterTextActive: {
    color: colors.primary,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  recordingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  recordingInfo: {
    flex: 1,
  },
  recordingDate: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  recordingMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metaText: {
    fontSize: 12,
    color: colors.textLight,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
  deleteButton: {
    borderColor: '#FF3B30',
  },
});
