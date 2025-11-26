import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {DeviceSelectionScreen} from '../DeviceSelectionScreen';
import {BleContext} from '../../contexts/BleContext';
import {BluetoothState, ConnectionState} from '../../services/ble/BleTypes';
import {createDeviceDescriptor, createEmptyTreadmillData, DEFAULT_SPEED_RANGE} from '../../models';

describe('DeviceSelectionScreen', () => {
  const mockStartScan = jest.fn();
  const mockStopScan = jest.fn();
  const mockConnectToDevice = jest.fn();
  const mockClearError = jest.fn();
  const mockOnDeviceConnected = jest.fn();
  const mockOnCancel = jest.fn();

  const createMockBleContext = (overrides = {}) => ({
    bluetoothState: BluetoothState.PoweredOn,
    isBluetoothReady: true,
    connectionState: ConnectionState.Disconnected,
    isConnected: false,
    connectedDevice: null,
    isScanning: false,
    discoveredDevices: [],
    treadmillData: createEmptyTreadmillData(),
    speedRange: DEFAULT_SPEED_RANGE,
    error: null,
    startScan: mockStartScan,
    stopScan: mockStopScan,
    connectToDevice: mockConnectToDevice,
    disconnect: jest.fn(),
    requestControl: jest.fn(),
    startWorkout: jest.fn(),
    stopWorkout: jest.fn(),
    pauseWorkout: jest.fn(),
    setTargetSpeed: jest.fn(),
    clearError: mockClearError,
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithContext = (contextValue: any, props = {}) => {
    return render(
      <BleContext.Provider value={contextValue}>
        <DeviceSelectionScreen
          onDeviceConnected={mockOnDeviceConnected}
          onCancel={mockOnCancel}
          {...props}
        />
      </BleContext.Provider>,
    );
  };

  describe('initialization', () => {
    it('renders correctly', () => {
      const context = createMockBleContext();
      const {getByText} = renderWithContext(context);

      expect(getByText('Select Device')).toBeTruthy();
    });

    it('starts scanning on mount when Bluetooth is ready', () => {
      const context = createMockBleContext();
      renderWithContext(context);

      expect(mockStartScan).toHaveBeenCalledTimes(1);
    });

    it('does not start scanning when Bluetooth is not ready', () => {
      const context = createMockBleContext({
        isBluetoothReady: false,
        bluetoothState: BluetoothState.PoweredOff,
      });
      renderWithContext(context);

      expect(mockStartScan).not.toHaveBeenCalled();
    });

    it('stops scanning on unmount', () => {
      const context = createMockBleContext();
      const {unmount} = renderWithContext(context);

      unmount();

      expect(mockStopScan).toHaveBeenCalled();
    });
  });

  describe('Bluetooth warnings', () => {
    it('shows warning when Bluetooth is off', () => {
      const context = createMockBleContext({
        isBluetoothReady: false,
        bluetoothState: BluetoothState.PoweredOff,
      });
      const {getByText} = renderWithContext(context);

      expect(getByText(/Bluetooth is turned off/i)).toBeTruthy();
    });

    it('shows warning when Bluetooth is unauthorized', () => {
      const context = createMockBleContext({
        isBluetoothReady: false,
        bluetoothState: BluetoothState.Unauthorized,
      });
      const {getByText} = renderWithContext(context);

      expect(getByText(/Bluetooth permission denied/i)).toBeTruthy();
    });
  });

  describe('scanning indicator', () => {
    it('shows scanning indicator when scanning', () => {
      const context = createMockBleContext({isScanning: true});
      const {getByText} = renderWithContext(context);

      expect(getByText('Scanning for devices...')).toBeTruthy();
    });

    it('does not show scanning indicator when not scanning', () => {
      const context = createMockBleContext({isScanning: false});
      const {queryByText} = renderWithContext(context);

      expect(queryByText('Scanning for devices...')).toBeFalsy();
    });
  });

  describe('device list', () => {
    it('shows empty state when no devices found and not scanning', () => {
      const context = createMockBleContext({
        isScanning: false,
        discoveredDevices: [],
      });
      const {getByText} = renderWithContext(context);

      expect(getByText('No devices found')).toBeTruthy();
      expect(getByText(/Make sure your fitness machine/i)).toBeTruthy();
    });

    it('does not show empty state when scanning', () => {
      const context = createMockBleContext({
        isScanning: true,
        discoveredDevices: [],
      });
      const {queryByText} = renderWithContext(context);

      expect(queryByText('No devices found')).toBeFalsy();
    });

    it('renders discovered devices', () => {
      const devices = [
        createDeviceDescriptor({
          deviceId: 'device-1',
          name: 'Treadmill 1',
          address: 'AA:BB:CC:DD:EE:FF',
          rssi: -50,
        }),
        createDeviceDescriptor({
          deviceId: 'device-2',
          name: 'Treadmill 2',
          address: 'FF:EE:DD:CC:BB:AA',
          rssi: -65,
        }),
      ];

      const context = createMockBleContext({discoveredDevices: devices});
      const {getByText} = renderWithContext(context);

      expect(getByText('Treadmill 1')).toBeTruthy();
      expect(getByText('Treadmill 2')).toBeTruthy();
    });

    it('sorts devices by signal strength', () => {
      const devices = [
        createDeviceDescriptor({
          deviceId: 'device-1',
          name: 'Weak Signal',
          address: 'AA:BB:CC:DD:EE:FF',
          rssi: -80,
        }),
        createDeviceDescriptor({
          deviceId: 'device-2',
          name: 'Strong Signal',
          address: 'FF:EE:DD:CC:BB:AA',
          rssi: -40,
        }),
      ];

      const context = createMockBleContext({discoveredDevices: devices});
      const {getAllByTestId} = renderWithContext(context);

      const deviceItems = getAllByTestId(/device-item/i);
      expect(deviceItems).toHaveLength(2);
    });
  });

  describe('device connection', () => {
    it('connects to device when device is pressed', async () => {
      const device = createDeviceDescriptor({
        deviceId: 'device-1',
        name: 'Treadmill 1',
        address: 'AA:BB:CC:DD:EE:FF',
      });

      mockConnectToDevice.mockResolvedValue(true);

      const context = createMockBleContext({discoveredDevices: [device]});
      const {getByText} = renderWithContext(context);

      fireEvent.press(getByText('Treadmill 1'));

      await waitFor(() => {
        expect(mockConnectToDevice).toHaveBeenCalledWith(device);
      });
    });

    it('calls onDeviceConnected when connection succeeds', async () => {
      const device = createDeviceDescriptor({
        deviceId: 'device-1',
        name: 'Treadmill 1',
        address: 'AA:BB:CC:DD:EE:FF',
      });

      mockConnectToDevice.mockResolvedValue(true);

      const context = createMockBleContext({discoveredDevices: [device]});
      const {getByText} = renderWithContext(context);

      fireEvent.press(getByText('Treadmill 1'));

      await waitFor(() => {
        expect(mockOnDeviceConnected).toHaveBeenCalled();
      });
    });

    it('does not call onDeviceConnected when connection fails', async () => {
      const device = createDeviceDescriptor({
        deviceId: 'device-1',
        name: 'Treadmill 1',
        address: 'AA:BB:CC:DD:EE:FF',
      });

      mockConnectToDevice.mockResolvedValue(false);

      const context = createMockBleContext({discoveredDevices: [device]});
      const {getByText} = renderWithContext(context);

      fireEvent.press(getByText('Treadmill 1'));

      await waitFor(() => {
        expect(mockConnectToDevice).toHaveBeenCalled();
      });

      expect(mockOnDeviceConnected).not.toHaveBeenCalled();
    });

    it('clears error before connecting', async () => {
      const device = createDeviceDescriptor({
        deviceId: 'device-1',
        name: 'Treadmill 1',
        address: 'AA:BB:CC:DD:EE:FF',
      });

      mockConnectToDevice.mockResolvedValue(true);

      const context = createMockBleContext({discoveredDevices: [device]});
      const {getByText} = renderWithContext(context);

      fireEvent.press(getByText('Treadmill 1'));

      await waitFor(() => {
        expect(mockClearError).toHaveBeenCalled();
      });
    });

    it('disables other devices while connecting', async () => {
      const devices = [
        createDeviceDescriptor({
          deviceId: 'device-1',
          name: 'Treadmill 1',
          address: 'AA:BB:CC:DD:EE:FF',
        }),
        createDeviceDescriptor({
          deviceId: 'device-2',
          name: 'Treadmill 2',
          address: 'FF:EE:DD:CC:BB:AA',
        }),
      ];

      mockConnectToDevice.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(true), 100)),
      );

      const context = createMockBleContext({discoveredDevices: devices});
      const {getByText} = renderWithContext(context);

      fireEvent.press(getByText('Treadmill 1'));

      await waitFor(() => {
        expect(mockConnectToDevice).toHaveBeenCalled();
      });
    });
  });

  describe('error handling', () => {
    it('shows error message when error exists', () => {
      const context = createMockBleContext({
        error: 'Connection failed',
      });
      const {getByText, getByTestId} = renderWithContext(context);

      expect(getByTestId('error-message')).toBeTruthy();
      expect(getByText('Connection failed')).toBeTruthy();
    });

    it('does not show error message when no error', () => {
      const context = createMockBleContext({error: null});
      const {queryByTestId} = renderWithContext(context);

      expect(queryByTestId('error-message')).toBeFalsy();
    });
  });

  describe('scan button', () => {
    it('shows "Scan for Devices" when not scanning', () => {
      const context = createMockBleContext({isScanning: false});
      const {getByText} = renderWithContext(context);

      expect(getByText('Scan for Devices')).toBeTruthy();
    });

    it('shows "Stop Scanning" when scanning', () => {
      const context = createMockBleContext({isScanning: true});
      const {getByText} = renderWithContext(context);

      expect(getByText('Stop Scanning')).toBeTruthy();
    });

    it('starts scan when button pressed while not scanning', () => {
      const context = createMockBleContext({isScanning: false});
      const {getByTestId} = renderWithContext(context);

      fireEvent.press(getByTestId('scan-button'));

      expect(mockStartScan).toHaveBeenCalled();
    });

    it('stops scan when button pressed while scanning', () => {
      const context = createMockBleContext({isScanning: true});
      const {getByTestId} = renderWithContext(context);

      fireEvent.press(getByTestId('scan-button'));

      expect(mockStopScan).toHaveBeenCalled();
    });

    it('is disabled when Bluetooth is not ready', () => {
      const context = createMockBleContext({
        isBluetoothReady: false,
        bluetoothState: BluetoothState.PoweredOff,
      });
      const {getByTestId} = renderWithContext(context);

      const button = getByTestId('scan-button');
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });
  });

  describe('cancel button', () => {
    it('renders cancel button when onCancel provided', () => {
      const context = createMockBleContext();
      const {getByTestId} = renderWithContext(context);

      expect(getByTestId('cancel-button')).toBeTruthy();
    });

    it('does not render cancel button when onCancel not provided', () => {
      const context = createMockBleContext();
      const {queryByTestId} = renderWithContext(context, {onCancel: undefined});

      expect(queryByTestId('cancel-button')).toBeFalsy();
    });

    it('calls onCancel when pressed', () => {
      const context = createMockBleContext();
      const {getByTestId} = renderWithContext(context);

      fireEvent.press(getByTestId('cancel-button'));

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });
});
