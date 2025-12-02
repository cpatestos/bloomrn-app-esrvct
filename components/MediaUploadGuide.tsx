
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';

export default function MediaUploadGuide() {
  return (
    <ScrollView style={styles.container}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.heading}>🎤 Recording Audio</Text>
        <Text style={commonStyles.text}>
          1. Tap "Record Audio" on the main screen{'\n'}
          2. Add an optional title and description{'\n'}
          3. Tap the microphone button to start recording{'\n'}
          4. Speak clearly into your device{'\n'}
          5. Tap "Stop Recording" when finished{'\n'}
          6. Your audio will automatically upload
        </Text>
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.heading}>🎥 Recording Video</Text>
        <Text style={commonStyles.text}>
          1. Tap "Record Video" on the main screen{'\n'}
          2. Grant camera permissions if prompted{'\n'}
          3. Tap the red button to start recording{'\n'}
          4. Tap again to stop recording{'\n'}
          5. Preview your video{'\n'}
          6. Tap "Upload" to save it
        </Text>
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.heading}>📁 Managing Recordings</Text>
        <Text style={commonStyles.text}>
          - View all recordings in "My Recordings"{'\n'}
          - Filter by audio or video{'\n'}
          - Play audio directly in the app{'\n'}
          - Delete recordings you no longer need{'\n'}
          - All recordings are private and secure
        </Text>
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.heading}>💡 Tips for Best Results</Text>
        <Text style={commonStyles.text}>
          <Text style={styles.bold}>Audio:</Text>{'\n'}
          - Find a quiet space{'\n'}
          - Hold device close to your mouth{'\n'}
          - Speak clearly and at a normal pace{'\n'}
          {'\n'}
          <Text style={styles.bold}>Video:</Text>{'\n'}
          - Ensure good lighting{'\n'}
          - Hold device steady or use a stand{'\n'}
          - Check your framing before recording{'\n'}
          - Keep recordings under 5 minutes
        </Text>
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.heading}>🔒 Privacy & Storage</Text>
        <Text style={commonStyles.text}>
          - All recordings are stored securely in Supabase{'\n'}
          - Only you can access your recordings{'\n'}
          - Files are organized by your user ID{'\n'}
          - Deleted recordings are permanently removed{'\n'}
          - Your data is encrypted in transit and at rest
        </Text>
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.heading}>⚙️ Technical Details</Text>
        <Text style={commonStyles.text}>
          <Text style={styles.bold}>Audio Format:</Text> M4A (AAC){'\n'}
          <Text style={styles.bold}>Video Format:</Text> MP4{'\n'}
          <Text style={styles.bold}>Max Duration:</Text> 5 minutes{'\n'}
          <Text style={styles.bold}>Storage:</Text> Supabase Storage{'\n'}
          <Text style={styles.bold}>Database:</Text> PostgreSQL with RLS
        </Text>
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.heading}>🐛 Troubleshooting</Text>
        <Text style={commonStyles.text}>
          <Text style={styles.bold}>Can&apos;t record audio:</Text>{'\n'}
          - Check microphone permissions in Settings{'\n'}
          - Ensure no other app is using the microphone{'\n'}
          {'\n'}
          <Text style={styles.bold}>Can&apos;t record video:</Text>{'\n'}
          - Check camera permissions in Settings{'\n'}
          - Ensure no other app is using the camera{'\n'}
          {'\n'}
          <Text style={styles.bold}>Upload fails:</Text>{'\n'}
          - Check your internet connection{'\n'}
          - Ensure you&apos;re logged in{'\n'}
          - Try recording a shorter clip{'\n'}
          {'\n'}
          <Text style={styles.bold}>Can&apos;t play recordings:</Text>{'\n'}
          - Check your internet connection{'\n'}
          - Try refreshing the recordings list
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bold: {
    fontWeight: '700',
    color: colors.text,
  },
});
