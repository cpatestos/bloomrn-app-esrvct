
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { UserProfile } from '@/types';
import * as ImagePicker from 'expo-image-picker';
import BotanicalBackground from '@/components/BotanicalBackground';

const AVATAR_EMOJIS = [
  '👤', '😊', '😄', '🤗', '😎', '🤓', '🥳', '😇',
  '🌟', '💫', '✨', '🌸', '🌺', '🌻', '🌷', '🌹',
  '🦋', '🐝', '🌈', '☀️', '🌙', '⭐', '💚', '💙',
];

export default function AvatarSelectionScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState('👤');
  const [customImage, setCustomImage] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const savedProfile = await storage.getUserProfile();
    setProfile(savedProfile);
    if (savedProfile?.avatarEmoji) {
      setSelectedEmoji(savedProfile.avatarEmoji);
    }
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        setCustomImage(result.assets[0].uri);
        setSelectedEmoji(''); // Clear emoji selection
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleComplete = async () => {
    if (!profile) return;

    const updatedProfile: UserProfile = {
      ...profile,
      avatarEmoji: customImage ? '' : selectedEmoji,
      avatarUrl: customImage || undefined,
      hasCompletedOnboarding: true,
    };

    await storage.saveUserProfile(updatedProfile);
    console.log('✅ Onboarding complete! Navigating to home...');
    
    // Use replace to prevent going back to onboarding
    router.replace('/(tabs)/(home)/');
  };

  const bgColor = isDark ? colors.darkBackground : colors.background;
  const textColor = isDark ? colors.darkText : colors.text;
  const cardColor = isDark ? colors.darkCard : colors.card;

  return (
    <View style={[commonStyles.container, { backgroundColor: bgColor }]}>
      <BotanicalBackground />
      <ScrollView contentContainerStyle={[commonStyles.content, styles.content]}>
        <Text style={[commonStyles.title, { color: textColor }]}>Choose Your Avatar</Text>
        <Text style={[commonStyles.textSecondary, styles.subtitle, { color: isDark ? colors.darkTextSecondary : colors.textSecondary }]}>
          Select An Emoji Or Upload A Custom Image
        </Text>

        <View style={[styles.previewCard, { backgroundColor: cardColor }]}>
          <Text style={styles.previewLabel}>Preview</Text>
          {customImage ? (
            <View style={styles.customImagePreview}>
              <Text style={styles.customImageText}>📷 Custom Image Selected</Text>
            </View>
          ) : (
            <Text style={styles.previewEmoji}>{selectedEmoji}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[buttonStyles.outline, styles.uploadButton]}
          onPress={handlePickImage}
        >
          <Text style={[buttonStyles.text, { color: colors.primary }]}>📷 Upload Custom Image</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: textColor }]}>Or Choose An Emoji</Text>
        <View style={styles.emojiGrid}>
          {AVATAR_EMOJIS.map((emoji) => (
            <TouchableOpacity
              key={emoji}
              style={[
                styles.emojiButton,
                { backgroundColor: cardColor },
                selectedEmoji === emoji && !customImage && styles.emojiButtonSelected,
              ]}
              onPress={() => {
                setSelectedEmoji(emoji);
                setCustomImage(null);
              }}
            >
              <Text style={styles.emoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[buttonStyles.primary, styles.button]}
          onPress={handleComplete}
        >
          <Text style={buttonStyles.textLight}>Complete Setup</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 80,
  },
  subtitle: {
    marginBottom: 24,
  },
  previewCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  previewEmoji: {
    fontSize: 80,
  },
  customImagePreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customImageText: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.primaryDark,
  },
  uploadButton: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  emojiButton: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiButtonSelected: {
    borderColor: colors.primary,
    boxShadow: '0px 2px 8px rgba(79, 195, 247, 0.3)',
    elevation: 3,
  },
  emoji: {
    fontSize: 32,
  },
  button: {
    width: '100%',
  },
});
