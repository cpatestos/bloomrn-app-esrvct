
import { supabase } from '@/app/integrations/supabase/client';
import { MediaRecording } from '@/types';
import * as FileSystem from 'expo-file-system/legacy';

// Helper to get current user ID
const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};

export const mediaService = {
  /**
   * Upload an audio recording to Supabase Storage
   * @param fileUri - Local file URI from the recording
   * @param title - Optional title for the recording
   * @param description - Optional description
   * @param durationSeconds - Duration of the recording in seconds
   * @returns The uploaded file path or null if failed
   */
  async uploadAudio(
    fileUri: string,
    title?: string,
    description?: string,
    durationSeconds?: number
  ): Promise<string | null> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        console.error('No user logged in');
        return null;
      }

      // Read the file as base64
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        console.error('File does not exist');
        return null;
      }

      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to blob
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/m4a' });

      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}.m4a`;
      const filePath = `${userId}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('audio-recordings')
        .upload(filePath, blob, {
          contentType: 'audio/m4a',
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Error uploading audio:', error);
        return null;
      }

      // Save metadata to database
      const fileSize = fileInfo.size || 0;
      await this.saveMediaMetadata({
        userId,
        mediaType: 'audio',
        filePath: data.path,
        title,
        description,
        durationSeconds,
        fileSizeBytes: fileSize,
      });

      console.log('Audio uploaded successfully:', data.path);
      return data.path;
    } catch (error) {
      console.error('Error in uploadAudio:', error);
      return null;
    }
  },

  /**
   * Upload a video recording to Supabase Storage
   * @param fileUri - Local file URI from the recording
   * @param title - Optional title for the recording
   * @param description - Optional description
   * @param durationSeconds - Duration of the recording in seconds
   * @returns The uploaded file path or null if failed
   */
  async uploadVideo(
    fileUri: string,
    title?: string,
    description?: string,
    durationSeconds?: number
  ): Promise<string | null> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        console.error('No user logged in');
        return null;
      }

      // Read the file as base64
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        console.error('File does not exist');
        return null;
      }

      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to blob
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'video/mp4' });

      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}.mp4`;
      const filePath = `${userId}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('video-recordings')
        .upload(filePath, blob, {
          contentType: 'video/mp4',
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Error uploading video:', error);
        return null;
      }

      // Save metadata to database
      const fileSize = fileInfo.size || 0;
      await this.saveMediaMetadata({
        userId,
        mediaType: 'video',
        filePath: data.path,
        title,
        description,
        durationSeconds,
        fileSizeBytes: fileSize,
      });

      console.log('Video uploaded successfully:', data.path);
      return data.path;
    } catch (error) {
      console.error('Error in uploadVideo:', error);
      return null;
    }
  },

  /**
   * Save media metadata to the database
   */
  async saveMediaMetadata(metadata: {
    userId: string;
    mediaType: 'audio' | 'video';
    filePath: string;
    title?: string;
    description?: string;
    durationSeconds?: number;
    fileSizeBytes?: number;
  }): Promise<boolean> {
    try {
      const { error } = await supabase.from('media_recordings').insert({
        user_id: metadata.userId,
        media_type: metadata.mediaType,
        file_path: metadata.filePath,
        title: metadata.title || null,
        description: metadata.description || null,
        duration_seconds: metadata.durationSeconds || null,
        file_size_bytes: metadata.fileSizeBytes || null,
      });

      if (error) {
        console.error('Error saving media metadata:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveMediaMetadata:', error);
      return false;
    }
  },

  /**
   * Get all media recordings for the current user
   */
  async getMediaRecordings(mediaType?: 'audio' | 'video'): Promise<MediaRecording[]> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return [];

      let query = supabase
        .from('media_recordings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (mediaType) {
        query = query.eq('media_type', mediaType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching media recordings:', error);
        return [];
      }

      return data.map(d => ({
        id: d.id,
        userId: d.user_id,
        mediaType: d.media_type as 'audio' | 'video',
        filePath: d.file_path,
        title: d.title || undefined,
        description: d.description || undefined,
        durationSeconds: d.duration_seconds || undefined,
        fileSizeBytes: d.file_size_bytes || undefined,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    } catch (error) {
      console.error('Error in getMediaRecordings:', error);
      return [];
    }
  },

  /**
   * Get a signed URL for accessing a media file
   */
  async getMediaUrl(bucket: 'audio-recordings' | 'video-recordings', filePath: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 3600); // URL valid for 1 hour

      if (error) {
        console.error('Error getting signed URL:', error);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Error in getMediaUrl:', error);
      return null;
    }
  },

  /**
   * Delete a media recording
   */
  async deleteMediaRecording(recordingId: string, bucket: 'audio-recordings' | 'video-recordings', filePath: string): Promise<boolean> {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (storageError) {
        console.error('Error deleting from storage:', storageError);
        return false;
      }

      // Delete metadata from database
      const { error: dbError } = await supabase
        .from('media_recordings')
        .delete()
        .eq('id', recordingId);

      if (dbError) {
        console.error('Error deleting metadata:', dbError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteMediaRecording:', error);
      return false;
    }
  },
};
