
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { UserProfile } from '@/types';
import BotanicalBackground from '@/components/BotanicalBackground';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const userProfile = await storage.getUserProfile();
    setProfile(userProfile);
  };

  const handleChangeAvatar = async () => {
    router.push('/onboarding/avatar-selection');
  };

  const handleChangeRole = () => {
    Alert.alert(
      'Change Role',
      'Are you sure you want to change your role? This will reset your profile.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change',
          style: 'destructive',
          onPress: async () => {
            await storage.clearUserProfile();
            router.replace('/onboarding/welcome');
          },
        },
      ]
    );
  };

  const bgColor = isDark ? colors.darkBackground : colors.background;
  const textColor = isDark ? colors.darkText : colors.text;
  const cardColor = isDark ? colors.darkCard : colors.card;

  return (
    <SafeAreaView style={[commonStyles.container, { backgroundColor: bgColor }]} edges={['top']}>
      <BotanicalBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[commonStyles.title, { color: textColor }]}>Profile</Text>
        </View>

        <View style={[styles.avatarSection, { backgroundColor: cardColor }]}>
          <Text style={styles.avatar}>{profile?.avatarEmoji || '👤'}</Text>
          <Text style={[styles.name, { color: textColor }]}>{profile?.firstName || 'User'}</Text>
          <View style={[styles.roleBadge, { backgroundColor: isDark ? colors.darkBackground : colors.highlight }]}>
            <Text style={[styles.roleBadgeText, { color: textColor }]}>
              {profile?.role === 'student' ? '🎓 Student Nurse' : '⚕️ Registered Nurse'}
            </Text>
          </View>
          <TouchableOpacity
            style={[buttonStyles.outline, styles.changeAvatarButton]}
            onPress={handleChangeAvatar}
          >
            <Text style={[buttonStyles.text, { color: colors.primary }]}>Change Avatar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={[commonStyles.subtitle, { color: textColor }]}>Profile Information</Text>
          
          {profile?.role === 'student' && (
            <>
              {profile.programType && (
                <View style={[commonStyles.cardSmall, { backgroundColor: cardColor }]}>
                  <Text style={[styles.infoLabel, { color: isDark ? colors.darkTextSecondary : colors.textSecondary }]}>Program Type</Text>
                  <Text style={[styles.infoValue, { color: textColor }]}>{profile.programType}</Text>
                </View>
              )}
              {profile.semester && (
                <View style={[commonStyles.cardSmall, { backgroundColor: cardColor }]}>
                  <Text style={[styles.infoLabel, { color: isDark ? colors.darkTextSecondary : colors.textSecondary }]}>Semester/Year</Text>
                  <Text style={[styles.infoValue, { color: textColor }]}>{profile.semester}</Text>
                </View>
              )}
            </>
          )}

          {profile?.role === 'rn' && (
            <>
              {profile.yearsExperience && (
                <View style={[commonStyles.cardSmall, { backgroundColor: cardColor }]}>
                  <Text style={[styles.infoLabel, { color: isDark ? colors.darkTextSecondary : colors.textSecondary }]}>Years Of Experience</Text>
                  <Text style={[styles.infoValue, { color: textColor }]}>{profile.yearsExperience}</Text>
                </View>
              )}
              {profile.setting && (
                <View style={[commonStyles.cardSmall, { backgroundColor: cardColor }]}>
                  <Text style={[styles.infoLabel, { color: isDark ? colors.darkTextSecondary : colors.textSecondary }]}>Work Setting</Text>
                  <Text style={[styles.infoValue, { color: textColor }]}>{profile.setting}</Text>
                </View>
              )}
            </>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[buttonStyles.outline, styles.actionButton]}
            onPress={handleChangeRole}
          >
            <Text style={[buttonStyles.text, { color: colors.primary }]}>Change Role</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  avatarSection: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  avatar: {
    fontSize: 80,
    marginBottom: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  roleBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  changeAvatarButton: {
    width: '100%',
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  actions: {
    paddingHorizontal: 20,
  },
  actionButton: {
    marginBottom: 12,
  },
});
