import {DeviceDescriptor, SupportedSpeedRange, TreadmillData} from '../../models';
import {
  BluetoothState,
  BluetoothStateCallback,
  ConnectionState,
  ConnectionStateCallback,
  ConnectedFitnessMachine,
  DeviceDiscoveryCallback,
  BleOperationResult,
} from './BleTypes';

/**
 * Interface for the Bluetooth Low Energy service.
 * Abstracts the platform-specific BLE implementation.
 */
export interface BleService {
  /**
   * Initialize the BLE manager.
   * Must be called before any other methods.
   */
  initialize(): Promise<void>;

  /**
   * Destroy the BLE manager and clean up resources.
   */
  destroy(): void;

  /**
   * Get the current Bluetooth adapter state.
   */
  getBluetoothState(): BluetoothState;

  /**
   * Subscribe to Bluetooth state changes.
   * @returns Unsubscribe function
   */
  onBluetoothStateChange(callback: BluetoothStateCallback): () => void;

  /**
   * Start scanning for fitness machine devices.
   * @param onDeviceDiscovered Callback for each discovered device
   * @returns Unsubscribe function to stop scanning
   */
  startScan(onDeviceDiscovered: DeviceDiscoveryCallback): () => void;

  /**
   * Stop scanning for devices.
   */
  stopScan(): void;

  /**
   * Check if currently scanning for devices.
   */
  isScanning(): boolean;

  /**
   * Connect to a fitness machine device.
   * @param device The device to connect to
   */
  connect(device: DeviceDescriptor): Promise<BleOperationResult<ConnectedFitnessMachine>>;

  /**
   * Disconnect from the current device.
   */
  disconnect(): Promise<void>;

  /**
   * Get the currently connected device, if any.
   */
  getConnectedDevice(): ConnectedFitnessMachine | null;

  /**
   * Get the current connection state.
   */
  getConnectionState(): ConnectionState;

  /**
   * Subscribe to connection state changes.
   * @returns Unsubscribe function
   */
  onConnectionStateChange(callback: ConnectionStateCallback): () => void;

  /**
   * Subscribe to treadmill data updates.
   * @returns Unsubscribe function
   */
  subscribeTreadmillData(
    callback: (data: TreadmillData) => void,
  ): Promise<() => void>;

  /**
   * Read the supported speed range from the device.
   */
  readSpeedRange(): Promise<BleOperationResult<SupportedSpeedRange>>;

  /**
   * Request control of the fitness machine.
   * Must be called before sending control commands.
   */
  requestControl(): Promise<BleOperationResult<void>>;

  /**
   * Send a start/resume command to the device.
   */
  sendStartCommand(): Promise<BleOperationResult<void>>;

  /**
   * Send a stop command to the device.
   */
  sendStopCommand(): Promise<BleOperationResult<void>>;

  /**
   * Send a pause command to the device.
   */
  sendPauseCommand(): Promise<BleOperationResult<void>>;

  /**
   * Set the target speed.
   * @param speedKmh Speed in km/h
   */
  setTargetSpeed(speedKmh: number): Promise<BleOperationResult<void>>;
}

/**
 * Creates a successful BLE operation result.
 */
export function bleSuccess<T>(data: T): BleOperationResult<T> {
  return {success: true, data};
}

/**
 * Creates a failed BLE operation result.
 */
export function bleError<T>(error: string): BleOperationResult<T> {
  return {success: false, error};
}
