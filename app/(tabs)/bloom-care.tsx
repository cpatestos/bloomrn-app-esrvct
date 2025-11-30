
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { storage } from '@/utils/storage';
import { SelfCareActivity, UserProfile } from '@/types';
import { defaultSelfCareActivities } from '@/data/selfCareActivities';
import { useRouter } from 'expo-router';

export default function BloomCareScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<SelfCareActivity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDuration, setSelectedDuration] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userProfile = await storage.getUserProfile();
    setProfile(userProfile);

    let savedActivities = await storage.getSelfCareActivities();
    if (savedActivities.length === 0) {
      savedActivities = defaultSelfCareActivities;
      await storage.saveSelfCareActivities(savedActivities);
    }
    setActivities(savedActivities);
  };

  const getCategories = () => {
    const baseCategories = ['All', 'Body', 'Mind', 'Heart'];
    if (profile?.role === 'student') {
      return [...baseCategories, 'Academic'];
    }
    if (profile?.role === 'rn') {
      return [...baseCategories, 'Boundaries'];
    }
    return baseCategories;
  };

  const getDurations = () => ['All', '2 min', '5 min', '10+ min'];

  const filterActivities = () => {
    let filtered = activities.filter(
      a => !a.roleTag || a.roleTag === profile?.role
    );

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }

    if (selectedDuration !== 'All') {
      if (selectedDuration === '2 min') {
        filtered = filtered.filter(a => a.durationMinutes <= 2);
      } else if (selectedDuration === '5 min') {
        filtered = filtered.filter(a => a.durationMinutes > 2 && a.durationMinutes <= 5);
      } else if (selectedDuration === '10+ min') {
        filtered = filtered.filter(a => a.durationMinutes > 5);
      }
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const toggleFavorite = async (activityId: string) => {
    const updated = activities.map(a =>
      a.id === activityId ? { ...a, isFavorite: !a.isFavorite } : a
    );
    setActivities(updated);
    await storage.saveSelfCareActivities(updated);
  };

  const favorites = activities.filter(a => a.isFavorite);
  const filteredActivities = filterActivities();

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>Bloom Care</Text>
        <Text style={commonStyles.text}>Self-care activities for your well-being</Text>
      </View>

      <TextInput
        style={commonStyles.input}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search activities..."
        placeholderTextColor={colors.textSecondary}
      />

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {getCategories().map((category, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  selectedCategory === category && styles.filterChipSelected,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedCategory === category && styles.filterChipTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </ScrollView>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Duration</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {getDurations().map((duration, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  selectedDuration === duration && styles.filterChipSelected,
                ]}
                onPress={() => setSelectedDuration(duration)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedDuration === duration && styles.filterChipTextSelected,
                  ]}
                >
                  {duration}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </ScrollView>
      </View>

      {favorites.length > 0 && (
        <View style={styles.section}>
          <Text style={commonStyles.subtitle}>Favorites ⭐</Text>
          {favorites.map((activity, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                style={commonStyles.card}
                onPress={() => router.push({
                  pathname: '/activity-detail',
                  params: { activityId: activity.id },
                })}
              >
                <View style={styles.activityHeader}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <TouchableOpacity onPress={() => toggleFavorite(activity.id)}>
                    <Text style={styles.favoriteIcon}>⭐</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.activityDescription} numberOfLines={2}>
                  {activity.description}
                </Text>
                <Text style={styles.activityMeta}>
                  {activity.durationMinutes} min • {activity.category}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={commonStyles.subtitle}>
          All Activities ({filteredActivities.length})
        </Text>
        {filteredActivities.map((activity, index) => (
          <React.Fragment key={index}>
            <TouchableOpacity
              style={commonStyles.card}
              onPress={() => router.push({
                pathname: '/activity-detail',
                params: { activityId: activity.id },
              })}
            >
              <View style={styles.activityHeader}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <TouchableOpacity onPress={() => toggleFavorite(activity.id)}>
                  <Text style={styles.favoriteIcon}>
                    {activity.isFavorite ? '⭐' : '☆'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.activityDescription} numberOfLines={2}>
                {activity.description}
              </Text>
              <Text style={styles.activityMeta}>
                {activity.durationMinutes} min • {activity.category}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 20,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.text,
  },
  filterChipTextSelected: {
    fontWeight: '600',
  },
  section: {
    marginTop: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  favoriteIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  activityDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  activityMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
