import {
  DeviceDescriptor,
  SupportedSpeedRange,
  TreadmillData,
  createEmptyTreadmillData,
  DEFAULT_SPEED_RANGE,
} from '../../models';
import {BleService, bleSuccess, bleError} from './BleService';
import {
  BluetoothState,
  BluetoothStateCallback,
  ConnectionState,
  ConnectionStateCallback,
  ConnectedFitnessMachine,
  DeviceDiscoveryCallback,
  BleOperationResult,
  createConnectedFitnessMachine,
} from './BleTypes';

/**
 * Mock BLE service for testing and development.
 * Simulates BLE operations without actual hardware.
 */
export class MockBleService implements BleService {
  private bluetoothState: BluetoothState = BluetoothState.PoweredOn;
  private connectionState: ConnectionState = ConnectionState.Disconnected;
  private connectedDevice: ConnectedFitnessMachine | null = null;
  private scanning = false;

  private bluetoothStateCallbacks: Set<BluetoothStateCallback> = new Set();
  private connectionStateCallbacks: Set<ConnectionStateCallback> = new Set();
  private treadmillDataCallbacks: Set<(data: TreadmillData) => void> =
    new Set();

  private treadmillDataInterval: ReturnType<typeof setInterval> | null = null;
  private currentSpeed = 0;
  private currentDistance = 0;
  private currentTime = 0;
  private currentSteps = 0;
  private currentCalories = 0;
  private isRunning = false;

  // Test helper properties
  public mockDevices: DeviceDescriptor[] = [
    {
      deviceId: 'mock-device-1',
      name: 'Mock Treadmill',
      address: 'AA:BB:CC:DD:EE:FF',
      rssi: -50,
    },
    {
      deviceId: 'mock-device-2',
      name: 'Mock Treadmill 2',
      address: '11:22:33:44:55:66',
      rssi: -65,
    },
  ];

  async initialize(): Promise<void> {
    // Simulated initialization delay
    await this.delay(100);
  }

  destroy(): void {
    this.stopDataSimulation();
    this.bluetoothStateCallbacks.clear();
    this.connectionStateCallbacks.clear();
    this.treadmillDataCallbacks.clear();
  }

  getBluetoothState(): BluetoothState {
    return this.bluetoothState;
  }

  onBluetoothStateChange(callback: BluetoothStateCallback): () => void {
    this.bluetoothStateCallbacks.add(callback);
    return () => {
      this.bluetoothStateCallbacks.delete(callback);
    };
  }

  startScan(onDeviceDiscovered: DeviceDiscoveryCallback): () => void {
    this.scanning = true;

    // Simulate device discovery with delays
    this.mockDevices.forEach((device, index) => {
      setTimeout(() => {
        if (this.scanning) {
          onDeviceDiscovered(device);
        }
      }, 500 + index * 300);
    });

    return () => {
      this.stopScan();
    };
  }

  stopScan(): void {
    this.scanning = false;
  }

  isScanning(): boolean {
    return this.scanning;
  }

  async connect(
    device: DeviceDescriptor,
  ): Promise<BleOperationResult<ConnectedFitnessMachine>> {
    if (this.bluetoothState !== BluetoothState.PoweredOn) {
      return bleError('Bluetooth is not enabled');
    }

    this.setConnectionState(ConnectionState.Connecting);

    // Simulate connection delay
    await this.delay(1000);

    this.connectedDevice = createConnectedFitnessMachine(device, {
      hasTreadmillData: true,
      hasControlPoint: true,
      hasSpeedRange: true,
    });

    this.setConnectionState(ConnectionState.Connected);

    return bleSuccess(this.connectedDevice);
  }

  async disconnect(): Promise<void> {
    this.setConnectionState(ConnectionState.Disconnecting);
    this.stopDataSimulation();

    await this.delay(300);

    this.connectedDevice = null;
    this.setConnectionState(ConnectionState.Disconnected);
    this.resetWorkoutData();
  }

  getConnectedDevice(): ConnectedFitnessMachine | null {
    return this.connectedDevice;
  }

  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  onConnectionStateChange(callback: ConnectionStateCallback): () => void {
    this.connectionStateCallbacks.add(callback);
    return () => {
      this.connectionStateCallbacks.delete(callback);
    };
  }

  async subscribeTreadmillData(
    callback: (data: TreadmillData) => void,
  ): Promise<() => void> {
    this.treadmillDataCallbacks.add(callback);

    // Send initial data
    callback(this.getCurrentTreadmillData());

    return () => {
      this.treadmillDataCallbacks.delete(callback);
    };
  }

  async readSpeedRange(): Promise<BleOperationResult<SupportedSpeedRange>> {
    if (!this.connectedDevice) {
      return bleError('No device connected');
    }

    await this.delay(100);
    return bleSuccess(DEFAULT_SPEED_RANGE);
  }

  async requestControl(): Promise<BleOperationResult<void>> {
    if (!this.connectedDevice) {
      return bleError('No device connected');
    }

    await this.delay(100);
    return bleSuccess(undefined);
  }

  async sendStartCommand(): Promise<BleOperationResult<void>> {
    if (!this.connectedDevice) {
      return bleError('No device connected');
    }

    await this.delay(100);
    this.isRunning = true;
    this.startDataSimulation();
    return bleSuccess(undefined);
  }

  async sendStopCommand(): Promise<BleOperationResult<void>> {
    if (!this.connectedDevice) {
      return bleError('No device connected');
    }

    await this.delay(100);
    this.isRunning = false;
    this.currentSpeed = 0;
    this.stopDataSimulation();
    this.notifyTreadmillData();
    return bleSuccess(undefined);
  }

  async sendPauseCommand(): Promise<BleOperationResult<void>> {
    if (!this.connectedDevice) {
      return bleError('No device connected');
    }

    await this.delay(100);
    this.isRunning = false;
    this.stopDataSimulation();
    this.notifyTreadmillData();
    return bleSuccess(undefined);
  }

  async setTargetSpeed(speedKmh: number): Promise<BleOperationResult<void>> {
    if (!this.connectedDevice) {
      return bleError('No device connected');
    }

    await this.delay(50);
    this.currentSpeed = speedKmh;
    this.notifyTreadmillData();
    return bleSuccess(undefined);
  }

  // Test helper methods

  /**
   * Set the mock Bluetooth state (for testing)
   */
  setMockBluetoothState(state: BluetoothState): void {
    this.bluetoothState = state;
    this.bluetoothStateCallbacks.forEach(cb => cb(state));
  }

  /**
   * Simulate a device disconnection (for testing)
   */
  simulateDisconnection(): void {
    this.connectedDevice = null;
    this.setConnectionState(ConnectionState.Disconnected);
    this.stopDataSimulation();
  }

  // Private methods

  private setConnectionState(state: ConnectionState): void {
    this.connectionState = state;
    this.connectionStateCallbacks.forEach(cb => cb(state));
  }

  private getCurrentTreadmillData(): TreadmillData {
    return {
      speedInKmh: this.currentSpeed,
      distanceInKm: this.currentDistance,
      timeInSeconds: this.currentTime,
      indicatedKiloCalories: this.currentCalories,
      steps: this.currentSteps,
    };
  }

  private notifyTreadmillData(): void {
    const data = this.getCurrentTreadmillData();
    this.treadmillDataCallbacks.forEach(cb => cb(data));
  }

  private startDataSimulation(): void {
    if (this.treadmillDataInterval) {
      return;
    }

    this.treadmillDataInterval = setInterval(() => {
      if (this.isRunning && this.currentSpeed > 0) {
        // Simulate realistic data changes
        this.currentTime += 1;
        this.currentDistance += (this.currentSpeed / 3600); // km per second
        this.currentSteps += Math.floor(this.currentSpeed * 0.5); // rough step estimate
        this.currentCalories += this.currentSpeed * 0.05; // rough calorie estimate
      }
      this.notifyTreadmillData();
    }, 1000);
  }

  private stopDataSimulation(): void {
    if (this.treadmillDataInterval) {
      clearInterval(this.treadmillDataInterval);
      this.treadmillDataInterval = null;
    }
  }

  private resetWorkoutData(): void {
    this.currentSpeed = 0;
    this.currentDistance = 0;
    this.currentTime = 0;
    this.currentSteps = 0;
    this.currentCalories = 0;
    this.isRunning = false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
