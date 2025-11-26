import React, {useCallback} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainTabNavigator} from './MainTabNavigator';
import {DeviceSelectionScreen} from '../screens/DeviceSelectionScreen';
import type {RootStackParamList} from './types';
import {useNavigation} from '@react-navigation/native';

const Stack = createNativeStackNavigator<RootStackParamList>();

function DeviceSelectionModal(): React.JSX.Element {
  const navigation = useNavigation();

  const handleDeviceConnected = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <DeviceSelectionScreen
      onDeviceConnected={handleDeviceConnected}
      onCancel={handleCancel}
    />
  );
}

export function RootNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DeviceSelection"
        component={DeviceSelectionModal}
        options={{
          presentation: 'modal',
          headerTitle: 'Select Device',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#007AFF',
        }}
      />
    </Stack.Navigator>
  );
}
