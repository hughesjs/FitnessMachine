import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import {ControlScreen} from '../screens/ControlScreen';
import {WorkoutHistoryScreen} from '../screens/WorkoutHistoryScreen';
import type {MainTabParamList, RootStackNavigationProp} from './types';
import {useNavigation} from '@react-navigation/native';

const Tab = createBottomTabNavigator<MainTabParamList>();

function ControlTab(): React.JSX.Element {
  const navigation = useNavigation<RootStackNavigationProp<'Main'>>();

  const handleSelectDevice = () => {
    navigation.navigate('DeviceSelection');
  };

  return <ControlScreen onSelectDevice={handleSelectDevice} />;
}

function HistoryTab(): React.JSX.Element {
  return <WorkoutHistoryScreen />;
}

export function MainTabNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
      }}>
      <Tab.Screen
        name="Control"
        component={ControlTab}
        options={{
          tabBarLabel: 'Control',
          tabBarIcon: ({color, size}) => (
            <Text style={{fontSize: size, color}}>&#x1F3C3;</Text>
          ),
          tabBarAccessibilityLabel: 'Control Tab',
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryTab}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({color, size}) => (
            <Text style={{fontSize: size, color}}>&#x1F4CA;</Text>
          ),
          tabBarAccessibilityLabel: 'History Tab',
        }}
      />
    </Tab.Navigator>
  );
}
