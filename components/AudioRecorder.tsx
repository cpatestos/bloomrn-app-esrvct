
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { mediaService } from '@/services/mediaService';

interface AudioRecorderProps {
  onUploadComplete?: (filePath: string) => void;
  title?: string;
  description?: string;
}

export default function AudioRecorder({ onUploadComplete, title, description }: AudioRecorderProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync().catch(console.error);
      }
    };
  }, [recording]);

  const startRecording = async () => {
    try {
      // Request permissions
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permission...');
        const permission = await requestPermission();
        if (!permission.granted) {
          Alert.alert('Permission Required', 'Please grant microphone permission to record audio');
          return;
        }
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording...');
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
      setRecordingDuration(0);

      // Update duration every second
      const interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      // Store interval ID for cleanup
      (newRecording as any).durationInterval = interval;

      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      console.log('Stopping recording...');
      setIsRecording(false);

      // Clear duration interval
      if ((recording as any).durationInterval) {
        clearInterval((recording as any).durationInterval);
      }

      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      console.log('Recording stopped, URI:', uri);

      if (uri) {
        // Upload the recording
        setIsUploading(true);
        const filePath = await mediaService.uploadAudio(
          uri,
          title,
          description,
          recordingDuration
        );

        setIsUploading(false);

        if (filePath) {
          Alert.alert('Success', 'Audio recording uploaded successfully!');
          if (onUploadComplete) {
            onUploadComplete(filePath);
          }
        } else {
          Alert.alert('Error', 'Failed to upload audio recording');
        }
      }

      setRecording(null);
      setRecordingDuration(0);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to stop recording');
      setIsUploading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        {isRecording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>Recording...</Text>
          </View>
        )}
        {isRecording && (
          <Text style={styles.durationText}>{formatDuration(recordingDuration)}</Text>
        )}
      </View>

      {isUploading ? (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.uploadingText}>Uploading audio...</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            buttonStyles.primary,
            isRecording ? styles.stopButton : styles.recordButton,
          ]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text style={[buttonStyles.text, { color: '#FFFFFF' }]}>
            {isRecording ? '⏹ Stop Recording' : '🎤 Start Recording'}
          </Text>
        </TouchableOpacity>
      )}

      <Text style={styles.infoText}>
        {isRecording
          ? 'Tap Stop Recording when finished'
          : 'Tap to start recording audio'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  statusContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
    marginRight: 8,
  },
  recordingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  durationText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  recordButton: {
    minWidth: 200,
  },
  stopButton: {
    minWidth: 200,
    backgroundColor: '#FF3B30',
  },
  uploadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  uploadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textLight,
  },
  infoText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});
