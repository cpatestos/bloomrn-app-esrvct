
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { resources } from '@/data/resources';

export default function ResourcesScreen() {
  const handleResourcePress = async (resource: typeof resources[0]) => {
    try {
      if (resource.actionType === 'url') {
        await Linking.openURL(resource.actionValue);
      } else if (resource.actionType === 'phone') {
        await Linking.openURL(`tel:${resource.actionValue}`);
      } else if (resource.actionType === 'email') {
        await Linking.openURL(`mailto:${resource.actionValue}`);
      }
    } catch (error) {
      console.error('Error opening resource:', error);
      Alert.alert('Error', 'Could not open this resource');
    }
  };

  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, typeof resources>);

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>Resources</Text>
        <Text style={commonStyles.text}>
          Helpful links and support services
        </Text>
      </View>

      {Object.entries(groupedResources).map(([category, categoryResources], categoryIndex) => (
        <React.Fragment key={categoryIndex}>
          <View style={styles.section}>
            <Text style={commonStyles.subtitle}>{category}</Text>
            {categoryResources.map((resource, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={commonStyles.card}
                  onPress={() => handleResourcePress(resource)}
                >
                  <View style={styles.resourceHeader}>
                    <Text style={styles.resourceTitle}>{resource.title}</Text>
                    <Text style={styles.resourceIcon}>
                      {resource.actionType === 'url' ? '🔗' : 
                       resource.actionType === 'phone' ? '📞' : '✉️'}
                    </Text>
                  </View>
                  <Text style={styles.resourceDescription}>
                    {resource.description}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </React.Fragment>
      ))}

      <View style={[commonStyles.card, styles.emergencyCard]}>
        <Text style={styles.emergencyTitle}>🚨 Emergency</Text>
        <Text style={styles.emergencyText}>
          If you&apos;re in crisis or experiencing a mental health emergency, call 988 (Suicide & Crisis Lifeline) or 911 immediately.
        </Text>
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
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  resourceIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  resourceDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  emergencyCard: {
    backgroundColor: colors.error,
    marginTop: 16,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: colors.card,
    lineHeight: 20,
  },
});
