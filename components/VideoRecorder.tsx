
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Camera, CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Video, ResizeMode } from 'expo-av';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { mediaService } from '@/services/mediaService';

interface VideoRecorderProps {
  onUploadComplete?: (filePath: string) => void;
  title?: string;
  description?: string;
}

export default function VideoRecorder({ onUploadComplete, title, description }: VideoRecorderProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          We need your permission to use the camera
        </Text>
        <TouchableOpacity style={buttonStyles.primary} onPress={requestPermission}>
          <Text style={[buttonStyles.text, { color: '#FFFFFF' }]}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const startRecording = async () => {
    if (!cameraRef.current) return;

    try {
      console.log('Starting video recording...');
      setIsRecording(true);
      setRecordingDuration(0);

      // Start duration counter
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      const video = await cameraRef.current.recordAsync({
        maxDuration: 300, // 5 minutes max
      });

      console.log('Video recorded:', video.uri);
      setVideoUri(video.uri);
    } catch (error) {
      console.error('Failed to record video:', error);
      Alert.alert('Error', 'Failed to record video');
      setIsRecording(false);
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    }
  };

  const stopRecording = async () => {
    if (!cameraRef.current) return;

    try {
      console.log('Stopping video recording...');
      setIsRecording(false);
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      await cameraRef.current.stopRecording();
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const uploadVideo = async () => {
    if (!videoUri) return;

    try {
      setIsUploading(true);
      const filePath = await mediaService.uploadVideo(
        videoUri,
        title,
        description,
        recordingDuration
      );

      setIsUploading(false);

      if (filePath) {
        Alert.alert('Success', 'Video recording uploaded successfully!');
        if (onUploadComplete) {
          onUploadComplete(filePath);
        }
        setVideoUri(null);
        setRecordingDuration(0);
      } else {
        Alert.alert('Error', 'Failed to upload video recording');
      }
    } catch (error) {
      console.error('Failed to upload video:', error);
      Alert.alert('Error', 'Failed to upload video');
      setIsUploading(false);
    }
  };

  const discardVideo = () => {
    setVideoUri(null);
    setRecordingDuration(0);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (videoUri) {
    return (
      <View style={styles.container}>
        <Video
          source={{ uri: videoUri }}
          style={styles.video}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
        />
        {isUploading ? (
          <View style={styles.uploadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.uploadingText}>Uploading video...</Text>
          </View>
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[buttonStyles.outline, styles.button]}
              onPress={discardVideo}
            >
              <Text style={buttonStyles.text}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[buttonStyles.primary, styles.button]}
              onPress={uploadVideo}
            >
              <Text style={[buttonStyles.text, { color: '#FFFFFF' }]}>Upload</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.overlay}>
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>Recording</Text>
              <Text style={styles.durationText}>{formatDuration(recordingDuration)}</Text>
            </View>
          )}

          <View style={styles.controls}>
            {!isRecording && (
              <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                <Text style={styles.flipText}>🔄</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.recordButton,
                isRecording && styles.recordButtonActive,
              ]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <View style={[styles.recordButtonInner, isRecording && styles.recordButtonInnerActive]} />
            </TouchableOpacity>

            <View style={styles.placeholder} />
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  camera: {
    flex: 1,
  },
  video: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    borderRadius: 20,
    marginTop: 40,
    alignSelf: 'center',
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
    color: '#FFFFFF',
    marginRight: 12,
  },
  durationText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  flipButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipText: {
    fontSize: 28,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  recordButtonActive: {
    borderColor: '#FF3B30',
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF3B30',
  },
  recordButtonInnerActive: {
    borderRadius: 8,
    width: 40,
    height: 40,
  },
  placeholder: {
    width: 60,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
  },
  button: {
    flex: 1,
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
  permissionText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});
