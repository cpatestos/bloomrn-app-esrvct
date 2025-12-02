
# Media Upload System Guide

## Overview

Your BloomRN app has a complete audio and video recording and upload system integrated with Supabase. This guide explains how everything works and how to use it.

## System Architecture

### Components

1. **AudioRecorder.tsx** - Handles audio recording using expo-av
2. **VideoRecorder.tsx** - Handles video recording using expo-camera
3. **mediaService.ts** - Manages all upload/download operations
4. **record-media.tsx** - Main recording interface
5. **view-recordings.tsx** - View and manage recordings

### Database Schema

**Table: media_recordings**
- `id` (uuid) - Primary key
- `user_id` (uuid) - Foreign key to auth.users
- `media_type` (text) - 'audio' or 'video'
- `file_path` (text) - Path in storage bucket
- `title` (text, optional) - User-provided title
- `description` (text, optional) - User-provided description
- `duration_seconds` (integer, optional) - Recording duration
- `file_size_bytes` (bigint, optional) - File size
- `created_at` (timestamptz) - Creation timestamp
- `updated_at` (timestamptz) - Last update timestamp

**RLS Policies:**
- Users can only view their own recordings
- Users can only insert recordings for themselves
- Users can only update their own recordings
- Users can only delete their own recordings

### Storage Buckets

**audio-recordings**
- Stores M4A audio files
- Files organized by user ID: `{userId}/{timestamp}.m4a`
- Private bucket with RLS policies

**video-recordings**
- Stores MP4 video files
- Files organized by user ID: `{userId}/{timestamp}.mp4`
- Private bucket with RLS policies

**Storage Policies:**
- Users can upload files to their own folder
- Users can view files in their own folder
- Users can delete files from their own folder

## How It Works

### Recording Audio

1. User navigates to `/media/record-media`
2. User optionally enters title and description
3. User taps "Record Audio"
4. App requests microphone permissions (if not granted)
5. User taps microphone button to start recording
6. Recording duration is displayed in real-time
7. User taps "Stop Recording" when finished
8. File is read from temporary storage
9. File is converted to Blob
10. File is uploaded to `audio-recordings` bucket
11. Metadata is saved to `media_recordings` table
12. Success message is displayed

### Recording Video

1. User navigates to `/media/record-media`
2. User optionally enters title and description
3. User taps "Record Video"
4. App requests camera permissions (if not granted)
5. Camera preview is displayed
6. User can flip between front/back camera
7. User taps red button to start recording
8. Recording duration is displayed in real-time
9. User taps button again to stop recording
10. Video preview is displayed
11. User can discard or upload the video
12. If uploaded, file is converted to Blob
13. File is uploaded to `video-recordings` bucket
14. Metadata is saved to `media_recordings` table
15. Success message is displayed

### Viewing Recordings

1. User navigates to `/media/view-recordings`
2. App fetches all recordings for the user
3. User can filter by All, Audio, or Video
4. Each recording shows:
   - Icon (🎤 for audio, 🎥 for video)
   - Title (or default name)
   - Date and time
   - Duration
   - File size
5. For audio recordings:
   - User can tap "Play" to listen
   - Audio plays directly in the app
   - User can tap "Stop" to stop playback
6. User can tap "Delete" to remove a recording
7. Confirmation dialog is shown before deletion
8. File is deleted from storage and database

## Technical Details

### File Formats

**Audio:**
- Format: M4A (AAC codec)
- Quality: High quality preset from expo-av
- Typical size: ~1MB per minute

**Video:**
- Format: MP4
- Quality: Default camera quality
- Max duration: 5 minutes
- Typical size: ~10-50MB per minute

### Upload Process

1. **Read File**: Uses `expo-file-system` to read the recorded file
2. **Convert to Base64**: File is read as base64 string
3. **Convert to Blob**: Base64 is converted to Uint8Array then Blob
4. **Upload**: Blob is uploaded to Supabase Storage
5. **Save Metadata**: Recording details are saved to database

### Security

- All files are stored in private buckets
- RLS policies ensure users can only access their own files
- Files are organized by user ID to prevent conflicts
- Signed URLs are used for playback (valid for 1 hour)
- All data is encrypted in transit (HTTPS)
- All data is encrypted at rest (Supabase default)

### Permissions

**iOS:**
- Microphone: Required for audio recording
- Camera: Required for video recording
- Requested automatically when needed

**Android:**
- RECORD_AUDIO: Required for audio recording
- CAMERA: Required for video recording
- Requested automatically when needed

## Usage Examples

### Basic Audio Recording

```typescript
import AudioRecorder from '@/components/AudioRecorder';

<AudioRecorder
  onUploadComplete={(filePath) => {
    console.log('Audio uploaded:', filePath);
  }}
/>
```

### Audio Recording with Metadata

```typescript
<AudioRecorder
  title="Morning Reflection"
  description="My thoughts on today's shift"
  onUploadComplete={(filePath) => {
    console.log('Audio uploaded:', filePath);
  }}
/>
```

### Basic Video Recording

```typescript
import VideoRecorder from '@/components/VideoRecorder';

<VideoRecorder
  onUploadComplete={(filePath) => {
    console.log('Video uploaded:', filePath);
  }}
/>
```

### Fetching Recordings

```typescript
import { mediaService } from '@/services/mediaService';

// Get all recordings
const allRecordings = await mediaService.getMediaRecordings();

// Get only audio recordings
const audioRecordings = await mediaService.getMediaRecordings('audio');

// Get only video recordings
const videoRecordings = await mediaService.getMediaRecordings('video');
```

### Playing Audio

```typescript
import { Audio } from 'expo-av';
import { mediaService } from '@/services/mediaService';

// Get signed URL
const url = await mediaService.getMediaUrl('audio-recordings', filePath);

// Load and play
const { sound } = await Audio.Sound.createAsync(
  { uri: url },
  { shouldPlay: true }
);

// Cleanup when done
await sound.unloadAsync();
```

### Deleting Recordings

```typescript
import { mediaService } from '@/services/mediaService';

const success = await mediaService.deleteMediaRecording(
  recordingId,
  'audio-recordings', // or 'video-recordings'
  filePath
);

if (success) {
  console.log('Recording deleted');
}
```

## Troubleshooting

### Audio Recording Issues

**Problem:** Can't record audio
- **Solution:** Check microphone permissions in device Settings
- **Solution:** Ensure no other app is using the microphone
- **Solution:** Restart the app

**Problem:** Recording is silent
- **Solution:** Check device volume
- **Solution:** Check if device is in silent mode
- **Solution:** Try speaking louder or closer to the microphone

### Video Recording Issues

**Problem:** Can't record video
- **Solution:** Check camera permissions in device Settings
- **Solution:** Ensure no other app is using the camera
- **Solution:** Restart the app

**Problem:** Video is dark
- **Solution:** Ensure adequate lighting
- **Solution:** Try using the front camera
- **Solution:** Adjust device position

### Upload Issues

**Problem:** Upload fails
- **Solution:** Check internet connection
- **Solution:** Ensure you're logged in
- **Solution:** Try recording a shorter clip
- **Solution:** Check available storage space

**Problem:** Upload is slow
- **Solution:** Connect to WiFi instead of cellular
- **Solution:** Record shorter clips
- **Solution:** Wait for better network conditions

### Playback Issues

**Problem:** Can't play recordings
- **Solution:** Check internet connection
- **Solution:** Try refreshing the recordings list
- **Solution:** Ensure the file wasn't deleted

**Problem:** Audio playback is choppy
- **Solution:** Check internet connection
- **Solution:** Wait for file to buffer
- **Solution:** Download the file for offline playback

## Best Practices

### For Users

1. **Audio Recording:**
   - Find a quiet space
   - Hold device close to your mouth
   - Speak clearly at a normal pace
   - Keep recordings under 5 minutes

2. **Video Recording:**
   - Ensure good lighting
   - Hold device steady or use a stand
   - Check framing before recording
   - Keep recordings under 5 minutes

3. **Storage Management:**
   - Delete old recordings you no longer need
   - Use descriptive titles for easy finding
   - Add descriptions for context

### For Developers

1. **Error Handling:**
   - Always wrap upload operations in try-catch
   - Show user-friendly error messages
   - Log errors for debugging

2. **Performance:**
   - Limit recording duration to prevent large files
   - Show upload progress for large files
   - Implement retry logic for failed uploads

3. **User Experience:**
   - Request permissions before showing recording UI
   - Show recording duration in real-time
   - Provide visual feedback during upload
   - Allow users to preview before uploading

## Future Enhancements

Potential improvements to consider:

1. **Offline Support:**
   - Queue uploads when offline
   - Sync when connection is restored

2. **Compression:**
   - Compress videos before upload
   - Reduce file sizes for faster uploads

3. **Editing:**
   - Trim audio/video before upload
   - Add filters or effects

4. **Sharing:**
   - Share recordings with other users
   - Export recordings to device

5. **Transcription:**
   - Automatic transcription of audio
   - Searchable text from recordings

6. **Organization:**
   - Folders or categories
   - Tags for better organization
   - Search functionality

## API Reference

### mediaService.uploadAudio()

Uploads an audio recording to Supabase Storage.

**Parameters:**
- `fileUri` (string): Local file URI from the recording
- `title` (string, optional): Title for the recording
- `description` (string, optional): Description
- `durationSeconds` (number, optional): Duration in seconds

**Returns:** Promise<string | null> - The uploaded file path or null if failed

### mediaService.uploadVideo()

Uploads a video recording to Supabase Storage.

**Parameters:**
- `fileUri` (string): Local file URI from the recording
- `title` (string, optional): Title for the recording
- `description` (string, optional): Description
- `durationSeconds` (number, optional): Duration in seconds

**Returns:** Promise<string | null> - The uploaded file path or null if failed

### mediaService.getMediaRecordings()

Fetches all media recordings for the current user.

**Parameters:**
- `mediaType` ('audio' | 'video', optional): Filter by media type

**Returns:** Promise<MediaRecording[]> - Array of recordings

### mediaService.getMediaUrl()

Gets a signed URL for accessing a media file.

**Parameters:**
- `bucket` ('audio-recordings' | 'video-recordings'): Storage bucket
- `filePath` (string): Path to the file

**Returns:** Promise<string | null> - Signed URL or null if failed

### mediaService.deleteMediaRecording()

Deletes a media recording from storage and database.

**Parameters:**
- `recordingId` (string): Recording ID
- `bucket` ('audio-recordings' | 'video-recordings'): Storage bucket
- `filePath` (string): Path to the file

**Returns:** Promise<boolean> - True if successful, false otherwise

## Support

For issues or questions:
1. Check this guide first
2. Review the troubleshooting section
3. Check the console logs for errors
4. Contact support with error details
