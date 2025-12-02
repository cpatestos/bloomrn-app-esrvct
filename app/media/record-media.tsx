
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import AudioRecorder from '@/components/AudioRecorder';
import VideoRecorder from '@/components/VideoRecorder';

export default function RecordMediaScreen() {
  const router = useRouter();
  const [mediaType, setMediaType] = useState<'audio' | 'video' | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleUploadComplete = (filePath: string) => {
    console.log('Upload complete:', filePath);
    Alert.alert(
      'Success',
      'Your recording has been uploaded successfully!',
      [
        {
          text: 'View Recordings',
          onPress: () => router.push('/media/view-recordings'),
        },
        {
          text: 'Record Another',
          onPress: () => {
            setMediaType(null);
            setTitle('');
            setDescription('');
          },
        },
      ]
    );
  };

  if (mediaType === 'audio') {
    return (
      <View style={commonStyles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setMediaType(null)}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={commonStyles.title}>Record Audio</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={commonStyles.card}>
            <Text style={commonStyles.heading}>Recording Details</Text>
            <TextInput
              style={commonStyles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Title (optional)"
              placeholderTextColor={colors.textLight}
            />
            <TextInput
              style={[commonStyles.input, styles.descriptionInput]}
              value={description}
              onChangeText={setDescription}
              placeholder="Description (optional)"
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={commonStyles.card}>
            <AudioRecorder
              onUploadComplete={handleUploadComplete}
              title={title}
              description={description}
            />
          </View>

          <View style={commonStyles.card}>
            <Text style={commonStyles.heading}>💡 Audio Tips</Text>
            <Text style={commonStyles.text}>
              - Find a quiet space for recording{'\n'}
              - Hold your device close to your mouth{'\n'}
              - Speak clearly at a normal pace{'\n'}
              - Recordings are automatically saved
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (mediaType === 'video') {
    return (
      <View style={[commonStyles.container, { padding: 0 }]}>
        <View style={styles.videoHeader}>
          <TouchableOpacity
            style={styles.videoBackButton}
            onPress={() => setMediaType(null)}
          >
            <Text style={styles.videoBackText}>← Back</Text>
          </TouchableOpacity>
        </View>
        <VideoRecorder
          onUploadComplete={handleUploadComplete}
          title={title}
          description={description}
        />
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={commonStyles.title}>Record Media</Text>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => router.push('/media/help')}
          >
            <Text style={styles.helpText}>❓</Text>
          </TouchableOpacity>
        </View>
        <Text style={commonStyles.text}>
          Choose what type of media you&apos;d like to record
        </Text>
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.heading}>Recording Details</Text>
        <Text style={commonStyles.textSecondary}>
          Add optional details before recording
        </Text>
        <TextInput
          style={commonStyles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Title (optional)"
          placeholderTextColor={colors.textLight}
        />
        <TextInput
          style={[commonStyles.input, styles.descriptionInput]}
          value={description}
          onChangeText={setDescription}
          placeholder="Description (optional)"
          placeholderTextColor={colors.textLight}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[buttonStyles.primary, styles.mediaButton]}
          onPress={() => setMediaType('audio')}
        >
          <Text style={styles.mediaIcon}>🎤</Text>
          <Text style={[buttonStyles.text, { color: '#FFFFFF' }]}>Record Audio</Text>
          <Text style={styles.mediaDescription}>
            Record voice notes, reflections, or audio journals
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[buttonStyles.primary, styles.mediaButton]}
          onPress={() => setMediaType('video')}
        >
          <Text style={styles.mediaIcon}>🎥</Text>
          <Text style={[buttonStyles.text, { color: '#FFFFFF' }]}>Record Video</Text>
          <Text style={styles.mediaDescription}>
            Record video reflections or visual journals
          </Text>
        </TouchableOpacity>
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.heading}>💡 Quick Tips</Text>
        <Text style={commonStyles.text}>
          <Text style={styles.bold}>Audio:</Text> Find a quiet space{'\n'}
          <Text style={styles.bold}>Video:</Text> Ensure good lighting{'\n'}
          <Text style={styles.bold}>Duration:</Text> Keep under 5 minutes{'\n'}
          <Text style={styles.bold}>Privacy:</Text> Your recordings are secure
        </Text>
      </View>

      <TouchableOpacity
        style={[buttonStyles.outline, { marginBottom: 24 }]}
        onPress={() => router.push('/media/view-recordings')}
      >
        <Text style={buttonStyles.text}>📁 View My Recordings</Text>
      </TouchableOpacity>
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
  backButton: {
    marginBottom: 12,
  },
  backText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  videoHeader: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  videoBackButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  videoBackText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 24,
  },
  mediaButton: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  mediaIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  mediaDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  bold: {
    fontWeight: '700',
    color: colors.text,
  },
});
