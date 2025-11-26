import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {ControlScreen} from '../ControlScreen';
import {BleContext, BleContextValue} from '../../contexts/BleContext';
import {WorkoutContext, WorkoutContextValue} from '../../contexts/WorkoutContext';
import {BluetoothState, ConnectionState} from '../../services/ble';
import {
  WorkoutState,
  createEmptyTreadmillData,
  DEFAULT_SPEED_RANGE,
  TreadmillData,
} from '../../models';

describe('ControlScreen', () => {
  const createMockBleContext = (
    overrides: Partial<BleContextValue> = {},
  ): BleContextValue => ({
    isConnected: true,
    isBluetoothReady: true,
    connectionState: ConnectionState.Connected,
    connectedDevice: {
      device: {
        deviceId: 'device-123',
        name: 'Test Treadmill',
        address: 'AA:BB:CC:DD:EE:FF',
      },
      hasTreadmillData: true,
      hasControlPoint: true,
      hasSpeedRange: true,
    },
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

  const createMockWorkoutContext = (
    overrides: Partial<WorkoutContextValue> = {},
  ): WorkoutContextValue => ({
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
    ...overrides,
  });

  const renderWithProviders = (
    bleContext: BleContextValue,
    workoutContext: WorkoutContextValue,
    props: Partial<React.ComponentProps<typeof ControlScreen>> = {},
  ) => {
    return render(
      <BleContext.Provider value={bleContext}>
        <WorkoutContext.Provider value={workoutContext}>
          <ControlScreen {...props} />
        </WorkoutContext.Provider>
      </BleContext.Provider>,
    );
  };

  describe('Not connected state', () => {
    it('shows not connected message when not connected', () => {
      const bleContext = createMockBleContext({isConnected: false});
      const workoutContext = createMockWorkoutContext();

      const {getByText} = renderWithProviders(bleContext, workoutContext);

      expect(getByText('No Device Connected')).toBeTruthy();
      expect(
        getByText('Connect to a fitness machine to start your workout'),
      ).toBeTruthy();
    });

    it('shows connect button when not connected', () => {
      const bleContext = createMockBleContext({isConnected: false});
      const workoutContext = createMockWorkoutContext();

      const {getByTestId} = renderWithProviders(bleContext, workoutContext);

      expect(getByTestId('connect-button')).toBeTruthy();
    });

    it('calls onSelectDevice when connect button is pressed', () => {
      const bleContext = createMockBleContext({isConnected: false});
      const workoutContext = createMockWorkoutContext();
      const mockOnSelectDevice = jest.fn();

      const {getByTestId} = renderWithProviders(bleContext, workoutContext, {
        onSelectDevice: mockOnSelectDevice,
      });

      fireEvent.press(getByTestId('connect-button'));

      expect(mockOnSelectDevice).toHaveBeenCalled();
    });
  });

  describe('Connected state', () => {
    it('shows device name when connected', () => {
      const bleContext = createMockBleContext();
      const workoutContext = createMockWorkoutContext();

      const {getByText} = renderWithProviders(bleContext, workoutContext);

      expect(getByText('Test Treadmill')).toBeTruthy();
      expect(getByText('Connected')).toBeTruthy();
    });

    it('shows disconnect button when connected', () => {
      const bleContext = createMockBleContext();
      const workoutContext = createMockWorkoutContext();

      const {getByTestId} = renderWithProviders(bleContext, workoutContext);

      expect(getByTestId('disconnect-button')).toBeTruthy();
    });

    it('calls disconnect when disconnect button is pressed', async () => {
      const mockDisconnect = jest.fn().mockResolvedValue(undefined);
      const mockOnDisconnect = jest.fn();
      const bleContext = createMockBleContext({disconnect: mockDisconnect});
      const workoutContext = createMockWorkoutContext();

      const {getByTestId} = renderWithProviders(bleContext, workoutContext, {
        onDisconnect: mockOnDisconnect,
      });

      fireEvent.press(getByTestId('disconnect-button'));

      await waitFor(() => {
        expect(mockDisconnect).toHaveBeenCalled();
      });
    });

    it('shows workout status panel', () => {
      const bleContext = createMockBleContext();
      const workoutContext = createMockWorkoutContext();

      const {getByTestId} = renderWithProviders(bleContext, workoutContext);

      expect(getByTestId('workout-status-panel')).toBeTruthy();
    });

    it('shows speed indicator', () => {
      const bleContext = createMockBleContext();
      const workoutContext = createMockWorkoutContext();

      const {getByTestId} = renderWithProviders(bleContext, workoutContext);

      expect(getByTestId('speed-indicator')).toBeTruthy();
    });

    it('shows treadmill controls', () => {
      const bleContext = createMockBleContext();
      const workoutContext = createMockWorkoutContext();

      const {getByTestId} = renderWithProviders(bleContext, workoutContext);

      expect(getByTestId('treadmill-controls')).toBeTruthy();
    });
  });

  describe('Error handling', () => {
    it('shows error message when error is present', () => {
      const bleContext = createMockBleContext({
        error: 'Connection failed',
      });
      const workoutContext = createMockWorkoutContext();

      const {getByTestId, getByText} = renderWithProviders(
        bleContext,
        workoutContext,
      );

      expect(getByTestId('error-message')).toBeTruthy();
      expect(getByText('Connection failed')).toBeTruthy();
    });

    it('does not show error message when there is no error', () => {
      const bleContext = createMockBleContext({error: null});
      const workoutContext = createMockWorkoutContext();

      const {queryByTestId} = renderWithProviders(bleContext, workoutContext);

      expect(queryByTestId('error-message')).toBeNull();
    });
  });

  describe('Workout controls', () => {
    it('starts workout when start button is pressed', async () => {
      const mockRequestControl = jest.fn().mockResolvedValue(true);
      const mockBleStart = jest.fn().mockResolvedValue(true);
      const mockLocalStart = jest.fn();
      const bleContext = createMockBleContext({
        requestControl: mockRequestControl,
        startWorkout: mockBleStart,
      });
      const workoutContext = createMockWorkoutContext({
        startWorkout: mockLocalStart,
      });

      const {getByTestId} = renderWithProviders(bleContext, workoutContext);

      fireEvent.press(getByTestId('start-button'));

      await waitFor(() => {
        expect(mockRequestControl).toHaveBeenCalled();
        expect(mockBleStart).toHaveBeenCalled();
        expect(mockLocalStart).toHaveBeenCalled();
      });
    });

    it('pauses workout when pause button is pressed', async () => {
      const mockBlePause = jest.fn().mockResolvedValue(true);
      const mockLocalPause = jest.fn();
      const bleContext = createMockBleContext({
        pauseWorkout: mockBlePause,
      });
      const workoutContext = createMockWorkoutContext({
        workoutState: WorkoutState.Running,
        canPause: true,
        pauseWorkout: mockLocalPause,
      });

      const {getByTestId} = renderWithProviders(bleContext, workoutContext);

      fireEvent.press(getByTestId('pause-button'));

      await waitFor(() => {
        expect(mockBlePause).toHaveBeenCalled();
        expect(mockLocalPause).toHaveBeenCalled();
      });
    });

    it('resumes workout when resume button is pressed', async () => {
      const mockBleStart = jest.fn().mockResolvedValue(true);
      const mockLocalResume = jest.fn();
      const bleContext = createMockBleContext({
        startWorkout: mockBleStart,
      });
      const workoutContext = createMockWorkoutContext({
        workoutState: WorkoutState.Paused,
        canResume: true,
        resumeWorkout: mockLocalResume,
      });

      const {getByTestId} = renderWithProviders(bleContext, workoutContext);

      fireEvent.press(getByTestId('resume-button'));

      await waitFor(() => {
        expect(mockBleStart).toHaveBeenCalled();
        expect(mockLocalResume).toHaveBeenCalled();
      });
    });

    it('stops workout when stop button is pressed', async () => {
      const mockBleStop = jest.fn().mockResolvedValue(true);
      const mockLocalStop = jest.fn().mockResolvedValue(undefined);
      const bleContext = createMockBleContext({
        stopWorkout: mockBleStop,
      });
      const workoutContext = createMockWorkoutContext({
        workoutState: WorkoutState.Running,
        canStop: true,
        stopWorkout: mockLocalStop,
      });

      const {getByTestId} = renderWithProviders(bleContext, workoutContext);

      fireEvent.press(getByTestId('stop-button'));

      await waitFor(() => {
        expect(mockBleStop).toHaveBeenCalled();
        expect(mockLocalStop).toHaveBeenCalled();
      });
    });
  });

  describe('Speed controls', () => {
    it('increases speed when speed up button is pressed', async () => {
      const mockSetTargetSpeed = jest.fn().mockResolvedValue(true);
      const treadmillData: TreadmillData = {
        ...createEmptyTreadmillData(),
        speedInKmh: 5.0,
      };
      const bleContext = createMockBleContext({
        treadmillData,
        setTargetSpeed: mockSetTargetSpeed,
      });
      const workoutContext = createMockWorkoutContext({
        workoutState: WorkoutState.Running,
        canPause: true,
      });

      const {getByTestId} = renderWithProviders(bleContext, workoutContext);

      fireEvent.press(getByTestId('speed-up-button'));

      await waitFor(() => {
        expect(mockSetTargetSpeed).toHaveBeenCalled();
      });
    });

    it('decreases speed when speed down button is pressed', async () => {
      const mockSetTargetSpeed = jest.fn().mockResolvedValue(true);
      const treadmillData: TreadmillData = {
        ...createEmptyTreadmillData(),
        speedInKmh: 5.0,
      };
      const bleContext = createMockBleContext({
        treadmillData,
        setTargetSpeed: mockSetTargetSpeed,
      });
      const workoutContext = createMockWorkoutContext({
        workoutState: WorkoutState.Running,
        canPause: true,
      });

      const {getByTestId} = renderWithProviders(bleContext, workoutContext);

      fireEvent.press(getByTestId('speed-down-button'));

      await waitFor(() => {
        expect(mockSetTargetSpeed).toHaveBeenCalled();
      });
    });
  });

  describe('Display data', () => {
    it('displays workout metrics from treadmill data', () => {
      const treadmillData: TreadmillData = {
        ...createEmptyTreadmillData(),
        distanceInKm: 2.5,
        timeInSeconds: 1800,
        steps: 3000,
        indicatedKiloCalories: 200,
        speedInKmh: 8.5,
      };
      const bleContext = createMockBleContext({treadmillData});
      const workoutContext = createMockWorkoutContext();

      const {getByText} = renderWithProviders(bleContext, workoutContext);

      expect(getByText('2.50')).toBeTruthy();
      expect(getByText('30:00')).toBeTruthy();
      expect(getByText('3,000')).toBeTruthy();
      expect(getByText('200')).toBeTruthy();
      expect(getByText('8.5')).toBeTruthy();
    });
  });
});
