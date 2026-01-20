import {MockBleService} from '../MockBleService';
import {BluetoothState, ConnectionState} from '../BleTypes';

describe('MockBleService', () => {
  let service: MockBleService;

  beforeEach(() => {
    service = new MockBleService();
  });

  afterEach(() => {
    service.destroy();
  });

  describe('initialization', () => {
    it('initializes with PoweredOn state', () => {
      expect(service.getBluetoothState()).toBe(BluetoothState.PoweredOn);
    });

    it('initializes with Disconnected connection state', () => {
      expect(service.getConnectionState()).toBe(ConnectionState.Disconnected);
    });

    it('initializes with no connected device', () => {
      expect(service.getConnectedDevice()).toBeNull();
    });
  });

  describe('scanning', () => {
    it('discovers mock devices', async () => {
      const discoveredDevices: string[] = [];

      service.startScan(device => {
        discoveredDevices.push(device.deviceId);
      });

      // Wait for discovery
      await new Promise(resolve => setTimeout(resolve, 1500));

      expect(discoveredDevices).toContain('mock-device-1');
      expect(discoveredDevices).toContain('mock-device-2');
    });

    it('stops discovering when stopScan is called', async () => {
      const discoveredDevices: string[] = [];

      const unsubscribe = service.startScan(device => {
        discoveredDevices.push(device.deviceId);
      });

      // Stop immediately
      unsubscribe();

      // Wait to verify no devices discovered
      await new Promise(resolve => setTimeout(resolve, 1000));

      expect(discoveredDevices).toHaveLength(0);
    });
  });

  describe('connection', () => {
    it('connects successfully to a device', async () => {
      const device = service.mockDevices[0]!;

      const result = await service.connect(device);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.device.deviceId).toBe(device.deviceId);
        expect(result.data.hasTreadmillData).toBe(true);
        expect(result.data.hasControlPoint).toBe(true);
      }
      expect(service.getConnectionState()).toBe(ConnectionState.Connected);
    });

    it('fails to connect when bluetooth is off', async () => {
      service.setMockBluetoothState(BluetoothState.PoweredOff);
      const device = service.mockDevices[0]!;

      const result = await service.connect(device);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Bluetooth is not enabled');
      }
    });

    it('updates connection state during connection', async () => {
      const states: ConnectionState[] = [];
      service.onConnectionStateChange(state => {
        states.push(state);
      });

      const device = service.mockDevices[0]!;
      await service.connect(device);

      expect(states).toContain(ConnectionState.Connecting);
      expect(states).toContain(ConnectionState.Connected);
    });

    it('disconnects successfully', async () => {
      const device = service.mockDevices[0]!;
      await service.connect(device);

      await service.disconnect();

      expect(service.getConnectionState()).toBe(ConnectionState.Disconnected);
      expect(service.getConnectedDevice()).toBeNull();
    });
  });

  describe('control commands', () => {
    beforeEach(async () => {
      const device = service.mockDevices[0]!;
      await service.connect(device);
    });

    it('requestControl succeeds when connected', async () => {
      const result = await service.requestControl();

      expect(result.success).toBe(true);
    });

    it('sendStartCommand succeeds when connected', async () => {
      const result = await service.sendStartCommand();

      expect(result.success).toBe(true);
    });

    it('sendStopCommand succeeds when connected', async () => {
      const result = await service.sendStopCommand();

      expect(result.success).toBe(true);
    });

    it('sendPauseCommand succeeds when connected', async () => {
      const result = await service.sendPauseCommand();

      expect(result.success).toBe(true);
    });

    it('setTargetSpeed succeeds when connected', async () => {
      const result = await service.setTargetSpeed(5.0);

      expect(result.success).toBe(true);
    });

    it('commands fail when not connected', async () => {
      await service.disconnect();

      const result = await service.requestControl();

      expect(result.success).toBe(false);
    });
  });

  describe('treadmill data', () => {
    beforeEach(async () => {
      const device = service.mockDevices[0]!;
      await service.connect(device);
    });

    it('subscribes to treadmill data', async () => {
      const dataUpdates: number[] = [];

      const unsubscribe = await service.subscribeTreadmillData(data => {
        dataUpdates.push(data.speedInKmh);
      });

      // Initial data should be sent
      expect(dataUpdates.length).toBeGreaterThan(0);

      unsubscribe();
    });

    it('receives speed updates when setTargetSpeed is called', async () => {
      let lastSpeed = 0;

      await service.subscribeTreadmillData(data => {
        lastSpeed = data.speedInKmh;
      });

      await service.setTargetSpeed(8.5);

      expect(lastSpeed).toBe(8.5);
    });
  });

  describe('speed range', () => {
    it('reads speed range when connected', async () => {
      const device = service.mockDevices[0]!;
      await service.connect(device);

      const result = await service.readSpeedRange();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.minSpeedInKmh).toBeDefined();
        expect(result.data.maxSpeedInKmh).toBeDefined();
        expect(result.data.minIncrementInKmh).toBeDefined();
      }
    });

    it('fails to read speed range when not connected', async () => {
      const result = await service.readSpeedRange();

      expect(result.success).toBe(false);
    });
  });

  describe('bluetooth state changes', () => {
    it('notifies callbacks on state change', () => {
      const states: BluetoothState[] = [];
      service.onBluetoothStateChange(state => {
        states.push(state);
      });

      service.setMockBluetoothState(BluetoothState.PoweredOff);
      service.setMockBluetoothState(BluetoothState.PoweredOn);

      expect(states).toContain(BluetoothState.PoweredOff);
      expect(states).toContain(BluetoothState.PoweredOn);
    });

    it('unsubscribes from state changes', () => {
      const states: BluetoothState[] = [];
      const unsubscribe = service.onBluetoothStateChange(state => {
        states.push(state);
      });

      unsubscribe();
      service.setMockBluetoothState(BluetoothState.PoweredOff);

      expect(states).toHaveLength(0);
    });
  });

  describe('simulated disconnection', () => {
    it('handles simulated disconnection', async () => {
      const device = service.mockDevices[0]!;
      await service.connect(device);

      service.simulateDisconnection();

      expect(service.getConnectionState()).toBe(ConnectionState.Disconnected);
      expect(service.getConnectedDevice()).toBeNull();
    });
  });
});
