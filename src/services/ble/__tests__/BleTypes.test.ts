import {
  BluetoothState,
  ConnectionState,
  createConnectedFitnessMachine,
  isBluetoothReady,
  getBluetoothStateMessage,
  getConnectionStateMessage,
} from '../BleTypes';

describe('BleTypes', () => {
  describe('isBluetoothReady', () => {
    it('returns true for PoweredOn', () => {
      expect(isBluetoothReady(BluetoothState.PoweredOn)).toBe(true);
    });

    it('returns false for other states', () => {
      expect(isBluetoothReady(BluetoothState.PoweredOff)).toBe(false);
      expect(isBluetoothReady(BluetoothState.Unauthorized)).toBe(false);
      expect(isBluetoothReady(BluetoothState.Unsupported)).toBe(false);
      expect(isBluetoothReady(BluetoothState.Resetting)).toBe(false);
      expect(isBluetoothReady(BluetoothState.Unknown)).toBe(false);
    });
  });

  describe('getBluetoothStateMessage', () => {
    it('returns appropriate message for each state', () => {
      expect(getBluetoothStateMessage(BluetoothState.PoweredOn)).toBe(
        'Bluetooth is ready',
      );
      expect(getBluetoothStateMessage(BluetoothState.PoweredOff)).toBe(
        'Bluetooth is turned off',
      );
      expect(getBluetoothStateMessage(BluetoothState.Unauthorized)).toBe(
        'Bluetooth permission denied',
      );
      expect(getBluetoothStateMessage(BluetoothState.Unsupported)).toBe(
        'Bluetooth is not supported on this device',
      );
      expect(getBluetoothStateMessage(BluetoothState.Resetting)).toBe(
        'Bluetooth is resetting...',
      );
      expect(getBluetoothStateMessage(BluetoothState.Unknown)).toBe(
        'Bluetooth state is unknown',
      );
    });
  });

  describe('getConnectionStateMessage', () => {
    it('returns appropriate message for each state', () => {
      expect(getConnectionStateMessage(ConnectionState.Connected)).toBe(
        'Connected',
      );
      expect(getConnectionStateMessage(ConnectionState.Connecting)).toBe(
        'Connecting...',
      );
      expect(getConnectionStateMessage(ConnectionState.Disconnecting)).toBe(
        'Disconnecting...',
      );
      expect(getConnectionStateMessage(ConnectionState.Disconnected)).toBe(
        'Disconnected',
      );
    });
  });

  describe('createConnectedFitnessMachine', () => {
    it('creates with default capabilities (all false)', () => {
      const device = {
        deviceId: 'test-id',
        name: 'Test Device',
        address: 'AA:BB:CC:DD:EE:FF',
      };

      const machine = createConnectedFitnessMachine(device);

      expect(machine.device).toEqual(device);
      expect(machine.hasTreadmillData).toBe(false);
      expect(machine.hasControlPoint).toBe(false);
      expect(machine.hasSpeedRange).toBe(false);
    });

    it('creates with specified capabilities', () => {
      const device = {
        deviceId: 'test-id',
        name: 'Test Device',
        address: 'AA:BB:CC:DD:EE:FF',
      };

      const machine = createConnectedFitnessMachine(device, {
        hasTreadmillData: true,
        hasControlPoint: true,
        hasSpeedRange: false,
      });

      expect(machine.hasTreadmillData).toBe(true);
      expect(machine.hasControlPoint).toBe(true);
      expect(machine.hasSpeedRange).toBe(false);
    });
  });
});
