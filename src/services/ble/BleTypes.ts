import {DeviceDescriptor} from '../../models';

/**
 * Bluetooth adapter state
 */
export enum BluetoothState {
  Unknown = 'Unknown',
  Resetting = 'Resetting',
  Unsupported = 'Unsupported',
  Unauthorized = 'Unauthorized',
  PoweredOff = 'PoweredOff',
  PoweredOn = 'PoweredOn',
}

/**
 * Connection state of a BLE device
 */
export enum ConnectionState {
  Disconnected = 'Disconnected',
  Connecting = 'Connecting',
  Connected = 'Connected',
  Disconnecting = 'Disconnecting',
}

/**
 * Result of a BLE operation
 */
export type BleOperationResult<T> =
  | {success: true; data: T}
  | {success: false; error: string};

/**
 * Callback for Bluetooth state changes
 */
export type BluetoothStateCallback = (state: BluetoothState) => void;

/**
 * Callback for device discovery during scanning
 */
export type DeviceDiscoveryCallback = (device: DeviceDescriptor) => void;

/**
 * Callback for device connection state changes
 */
export type ConnectionStateCallback = (state: ConnectionState) => void;

/**
 * Callback for characteristic value updates
 */
export type CharacteristicUpdateCallback = (value: Uint8Array) => void;

/**
 * Represents a connected fitness machine with discovered services
 */
export interface ConnectedFitnessMachine {
  /** The device descriptor */
  readonly device: DeviceDescriptor;
  /** Whether treadmill data characteristic is available */
  readonly hasTreadmillData: boolean;
  /** Whether control point characteristic is available */
  readonly hasControlPoint: boolean;
  /** Whether speed range characteristic is available */
  readonly hasSpeedRange: boolean;
}

/**
 * Creates an empty/default ConnectedFitnessMachine
 */
export function createConnectedFitnessMachine(
  device: DeviceDescriptor,
  capabilities?: {
    hasTreadmillData?: boolean;
    hasControlPoint?: boolean;
    hasSpeedRange?: boolean;
  },
): ConnectedFitnessMachine {
  return {
    device,
    hasTreadmillData: capabilities?.hasTreadmillData ?? false,
    hasControlPoint: capabilities?.hasControlPoint ?? false,
    hasSpeedRange: capabilities?.hasSpeedRange ?? false,
  };
}

/**
 * Checks if Bluetooth is available and enabled
 */
export function isBluetoothReady(state: BluetoothState): boolean {
  return state === BluetoothState.PoweredOn;
}

/**
 * Gets a user-friendly message for the Bluetooth state
 */
export function getBluetoothStateMessage(state: BluetoothState): string {
  switch (state) {
    case BluetoothState.PoweredOn:
      return 'Bluetooth is ready';
    case BluetoothState.PoweredOff:
      return 'Bluetooth is turned off';
    case BluetoothState.Unauthorized:
      return 'Bluetooth permission denied';
    case BluetoothState.Unsupported:
      return 'Bluetooth is not supported on this device';
    case BluetoothState.Resetting:
      return 'Bluetooth is resetting...';
    case BluetoothState.Unknown:
    default:
      return 'Bluetooth state is unknown';
  }
}

/**
 * Gets a user-friendly message for the connection state
 */
export function getConnectionStateMessage(state: ConnectionState): string {
  switch (state) {
    case ConnectionState.Connected:
      return 'Connected';
    case ConnectionState.Connecting:
      return 'Connecting...';
    case ConnectionState.Disconnecting:
      return 'Disconnecting...';
    case ConnectionState.Disconnected:
    default:
      return 'Disconnected';
  }
}
