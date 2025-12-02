
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger key="home" name="(home)">
        <Icon sf="house.fill" />
        <Label>HOME</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="wellness" name="wellness">
        <Icon sf="leaf.fill" />
        <Label>WELLNESS</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="journal" name="journal">
        <Icon sf="book.fill" />
        <Label>JOURNAL</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="profile" name="profile">
        <Icon sf="person.fill" />
        <Label>PROFILE</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
