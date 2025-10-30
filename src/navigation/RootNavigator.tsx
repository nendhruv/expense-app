import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AllEntriesScreen from '../screens/AllEntriesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EditEntrySheet from '../screens/EditEntrySheet';
import ComposeExpenseScreen from '../screens/ComposeExpenseScreen';

export type RootStackParamList = {
  Home: undefined;
  AllEntries: undefined;
  Settings: undefined;
  EditEntry: { id?: string } | undefined;
  Compose: { id?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        presentation: 'card',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AllEntries" component={AllEntriesScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="EditEntry"
        component={EditEntrySheet}
        options={{ presentation: 'transparentModal' }}
      />
      <Stack.Screen name="Compose" component={ComposeExpenseScreen} />
    </Stack.Navigator>
  );
}



