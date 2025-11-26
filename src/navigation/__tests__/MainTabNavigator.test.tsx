import React from 'react';
import {render} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {MainTabNavigator} from '../MainTabNavigator';
import {BleContext, BleContextValue} from '../../contexts/BleContext';
import {WorkoutContext, WorkoutContextValue} from '../../contexts/WorkoutContext';
import {
  WorkoutHistoryContext,
  WorkoutHistoryContextValue,
} from '../../contexts/WorkoutHistoryContext';
import {BluetoothState, ConnectionState} from '../../services/ble';
import {WorkoutState, createEmptyTreadmillData, DEFAULT_SPEED_RANGE} from '../../models';

describe('MainTabNavigator', () => {
  const createMockBleContext = (): BleContextValue => ({
    isConnected: false,
    isBluetoothReady: true,
    connectionState: ConnectionState.Disconnected,
    connectedDevice: null,
    treadmillData: createEmptyTreadmillData(),
    speedRange: DEFAULT_SPEED_RANGE,
    isScanning: false,
    discoveredDevices: [],
    bluetoothState: BluetoothState.PoweredOn,
    error: null,
    startScan: jest.fn(),
    stopScan: jest.fn(),
    connectToDevice: jest.fn().mockResolvedValue(true),
    disconnect: jest.fn().mockResolvedValue(undefined),
    requestControl: jest.fn().mockResolvedValue(true),
    startWorkout: jest.fn().mockResolvedValue(true),
    stopWorkout: jest.fn().mockResolvedValue(true),
    pauseWorkout: jest.fn().mockResolvedValue(true),
    setTargetSpeed: jest.fn().mockResolvedValue(true),
    clearError: jest.fn(),
  });

  const createMockWorkoutContext = (): WorkoutContextValue => ({
    workoutState: WorkoutState.Idle,
    canStart: true,
    canPause: false,
    canResume: false,
    canStop: false,
    workoutStartTime: null,
    startWorkout: jest.fn(),
    pauseWorkout: jest.fn(),
    resumeWorkout: jest.fn(),
    stopWorkout: jest.fn().mockResolvedValue(null),
    resetWorkout: jest.fn(),
  });

  const createMockWorkoutHistoryContext = (): WorkoutHistoryContextValue => ({
    workouts: [],
    isLoading: false,
    error: null,
    refresh: jest.fn().mockResolvedValue(undefined),
    deleteWorkout: jest.fn().mockResolvedValue(true),
    deleteAllWorkouts: jest.fn().mockResolvedValue(true),
    addWorkout: jest.fn(),
  });

  const renderWithProviders = () => {
    return render(
      <NavigationContainer>
        <BleContext.Provider value={createMockBleContext()}>
          <WorkoutContext.Provider value={createMockWorkoutContext()}>
            <WorkoutHistoryContext.Provider value={createMockWorkoutHistoryContext()}>
              <MainTabNavigator />
            </WorkoutHistoryContext.Provider>
          </WorkoutContext.Provider>
        </BleContext.Provider>
      </NavigationContainer>,
    );
  };

  it('renders without crashing', () => {
    const {getByText} = renderWithProviders();

    // Should render the Control tab by default
    expect(getByText('Control')).toBeTruthy();
    expect(getByText('History')).toBeTruthy();
  });

  it('shows Control and History tabs', () => {
    const {getByText} = renderWithProviders();

    expect(getByText('Control')).toBeTruthy();
    expect(getByText('History')).toBeTruthy();
  });

  it('shows the Control screen content by default', () => {
    const {getByText} = renderWithProviders();

    // The not connected message should appear since we're not connected
    expect(getByText('No Device Connected')).toBeTruthy();
  });
});
