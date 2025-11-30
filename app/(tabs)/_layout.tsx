
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'home',
      label: 'Home',
    },
    {
      name: 'bloom-care',
      route: '/(tabs)/bloom-care',
      icon: 'favorite',
      label: 'Bloom Care',
    },
    {
      name: 'work-study',
      route: '/(tabs)/work-study',
      icon: 'school',
      label: 'Work/Study',
    },
    {
      name: 'reflect',
      route: '/(tabs)/reflect',
      icon: 'edit_note',
      label: 'Reflect',
    },
    {
      name: 'resources',
      route: '/(tabs)/resources',
      icon: 'info',
      label: 'Resources',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="bloom-care" name="bloom-care" />
        <Stack.Screen key="work-study" name="work-study" />
        <Stack.Screen key="reflect" name="reflect" />
        <Stack.Screen key="resources" name="resources" />
      </Stack>
      <FloatingTabBar tabs={tabs} containerWidth={380} />
    </>
  );
}
