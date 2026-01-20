import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {RootNavigator} from '../RootNavigator';
import {BleContext, BleContextValue} from '../../contexts/BleContext';
import {WorkoutContext, WorkoutContextValue} from '../../contexts/WorkoutContext';
import {
  WorkoutHistoryContext,
  WorkoutHistoryContextValue,
} from '../../contexts/WorkoutHistoryContext';
import {BluetoothState, ConnectionState} from '../../services/ble';
import {WorkoutState, createEmptyTreadmillData, DEFAULT_SPEED_RANGE} from '../../models';

describe('RootNavigator', () => {
  const createMockBleContext = (
    overrides: Partial<BleContextValue> = {},
  ): BleContextValue => ({
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
    ...overrides,
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

  const renderWithProviders = (bleContextOverrides: Partial<BleContextValue> = {}) => {
    return render(
      <NavigationContainer>
        <BleContext.Provider value={createMockBleContext(bleContextOverrides)}>
          <WorkoutContext.Provider value={createMockWorkoutContext()}>
            <WorkoutHistoryContext.Provider value={createMockWorkoutHistoryContext()}>
              <RootNavigator />
            </WorkoutHistoryContext.Provider>
          </WorkoutContext.Provider>
        </BleContext.Provider>
      </NavigationContainer>,
    );
  };

  it('renders the main tab navigator', () => {
    const {getByText} = renderWithProviders();

    expect(getByText('Control')).toBeTruthy();
    expect(getByText('History')).toBeTruthy();
  });

  it('shows Connect Device button when not connected', () => {
    const {getByTestId} = renderWithProviders();

    expect(getByTestId('connect-button')).toBeTruthy();
  });

  it('opens device selection modal when Connect Device is pressed', async () => {
    const {getByTestId, getByText} = renderWithProviders();

    fireEvent.press(getByTestId('connect-button'));

    await waitFor(() => {
      expect(getByText('Select Device')).toBeTruthy();
    });
  });

  it('shows scanning indicator in device selection', async () => {
    const {getByTestId, getByText} = renderWithProviders({isScanning: true});

    fireEvent.press(getByTestId('connect-button'));

    await waitFor(() => {
      expect(getByText('Select Device')).toBeTruthy();
    });

    expect(getByTestId('scanning-indicator')).toBeTruthy();
  });
});
