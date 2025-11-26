import {BleManager, Device, State, Subscription} from 'react-native-ble-plx';
import {
  DeviceDescriptor,
  SupportedSpeedRange,
  TreadmillData,
  parseTreadmillData,
  parseSupportedSpeedRange,
  createDeviceDescriptor,
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
import {FITNESS_MACHINE_SERVICE_UUID, FtmsCharacteristics} from './constants';
import {
  buildRequestControlCommand,
  buildStartCommand,
  buildStopCommand,
  buildPauseCommand,
  buildSetTargetSpeedCommand,
} from './FtmsCommands';

/**
 * Maps react-native-ble-plx State to our BluetoothState
 */
function mapBleState(state: State): BluetoothState {
  switch (state) {
    case State.PoweredOn:
      return BluetoothState.PoweredOn;
    case State.PoweredOff:
      return BluetoothState.PoweredOff;
    case State.Unauthorized:
      return BluetoothState.Unauthorized;
    case State.Unsupported:
      return BluetoothState.Unsupported;
    case State.Resetting:
      return BluetoothState.Resetting;
    default:
      return BluetoothState.Unknown;
  }
}

/**
 * Converts a base64 string to Uint8Array
 */
function base64ToBytes(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Converts Uint8Array to base64 string
 */
function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i] ?? 0);
  }
  return btoa(binary);
}

/**
 * BLE service implementation using react-native-ble-plx.
 */
export class BleServiceImpl implements BleService {
  private manager: BleManager | null = null;
  private bluetoothState: BluetoothState = BluetoothState.Unknown;
  private connectionState: ConnectionState = ConnectionState.Disconnected;
  private connectedDevice: Device | null = null;
  private connectedMachine: ConnectedFitnessMachine | null = null;

  private stateSubscription: Subscription | null = null;
  private scanSubscription: Subscription | null = null;
  private deviceSubscription: Subscription | null = null;

  private bluetoothStateCallbacks: Set<BluetoothStateCallback> = new Set();
  private connectionStateCallbacks: Set<ConnectionStateCallback> = new Set();

  async initialize(): Promise<void> {
    this.manager = new BleManager();

    // Get initial state
    const state = await this.manager.state();
    this.bluetoothState = mapBleState(state);

    // Subscribe to state changes
    this.stateSubscription = this.manager.onStateChange(newState => {
      this.bluetoothState = mapBleState(newState);
      this.bluetoothStateCallbacks.forEach(cb => cb(this.bluetoothState));
    }, true);
  }

  destroy(): void {
    this.stateSubscription?.remove();
    this.scanSubscription?.remove();
    this.deviceSubscription?.remove();
    this.manager?.destroy();
    this.manager = null;
    this.bluetoothStateCallbacks.clear();
    this.connectionStateCallbacks.clear();
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
    if (!this.manager) {
      return () => {};
    }

    const discoveredIds = new Set<string>();

    this.manager.startDeviceScan(
      [FITNESS_MACHINE_SERVICE_UUID],
      {allowDuplicates: false},
      (error, device) => {
        if (error || !device) {
          return;
        }

        // Skip already discovered devices
        if (discoveredIds.has(device.id)) {
          return;
        }
        discoveredIds.add(device.id);

        const descriptor = createDeviceDescriptor({
          deviceId: device.id,
          name: device.name ?? device.localName ?? '',
          address: device.id,
          ...(device.rssi != null ? {rssi: device.rssi} : {}),
        });

        onDeviceDiscovered(descriptor);
      },
    );

    return () => {
      this.stopScan();
    };
  }

  stopScan(): void {
    this.manager?.stopDeviceScan();
  }

  isScanning(): boolean {
    // react-native-ble-plx doesn't expose scanning state directly
    // We track this through startScan/stopScan calls
    return false;
  }

  async connect(
    device: DeviceDescriptor,
  ): Promise<BleOperationResult<ConnectedFitnessMachine>> {
    if (!this.manager) {
      return bleError('BLE not initialized');
    }

    if (this.bluetoothState !== BluetoothState.PoweredOn) {
      return bleError('Bluetooth is not enabled');
    }

    try {
      this.setConnectionState(ConnectionState.Connecting);

      // Connect to the device
      this.connectedDevice = await this.manager.connectToDevice(device.deviceId);

      // Discover services and characteristics
      await this.connectedDevice.discoverAllServicesAndCharacteristics();

      // Get the services to check capabilities
      const services = await this.connectedDevice.services();
      const ftmsService = services.find(
        s => s.uuid.toLowerCase() === FITNESS_MACHINE_SERVICE_UUID.toLowerCase(),
      );

      let hasTreadmillData = false;
      let hasControlPoint = false;
      let hasSpeedRange = false;

      if (ftmsService) {
        const characteristics = await ftmsService.characteristics();
        hasTreadmillData = characteristics.some(
          c =>
            c.uuid.toLowerCase() ===
            FtmsCharacteristics.TREADMILL_DATA.toLowerCase(),
        );
        hasControlPoint = characteristics.some(
          c =>
            c.uuid.toLowerCase() ===
            FtmsCharacteristics.FITNESS_MACHINE_CONTROL_POINT.toLowerCase(),
        );
        hasSpeedRange = characteristics.some(
          c =>
            c.uuid.toLowerCase() ===
            FtmsCharacteristics.SUPPORTED_SPEED_RANGE.toLowerCase(),
        );
      }

      this.connectedMachine = createConnectedFitnessMachine(device, {
        hasTreadmillData,
        hasControlPoint,
        hasSpeedRange,
      });

      // Monitor disconnection
      this.deviceSubscription = this.connectedDevice.onDisconnected(() => {
        this.connectedDevice = null;
        this.connectedMachine = null;
        this.setConnectionState(ConnectionState.Disconnected);
      });

      this.setConnectionState(ConnectionState.Connected);

      return bleSuccess(this.connectedMachine);
    } catch (error) {
      this.connectedDevice = null;
      this.connectedMachine = null;
      this.setConnectionState(ConnectionState.Disconnected);
      return bleError(
        error instanceof Error ? error.message : 'Connection failed',
      );
    }
  }

  async disconnect(): Promise<void> {
    if (this.connectedDevice) {
      this.setConnectionState(ConnectionState.Disconnecting);

      try {
        await this.connectedDevice.cancelConnection();
      } catch {
        // Ignore disconnection errors
      }

      this.connectedDevice = null;
      this.connectedMachine = null;
      this.setConnectionState(ConnectionState.Disconnected);
    }
  }

  getConnectedDevice(): ConnectedFitnessMachine | null {
    return this.connectedMachine;
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
    if (!this.connectedDevice) {
      return () => {};
    }

    const subscription = this.connectedDevice.monitorCharacteristicForService(
      FITNESS_MACHINE_SERVICE_UUID,
      FtmsCharacteristics.TREADMILL_DATA,
      (error, characteristic) => {
        if (error || !characteristic?.value) {
          return;
        }

        const bytes = base64ToBytes(characteristic.value);
        const data = parseTreadmillData(bytes);
        callback(data);
      },
    );

    return () => {
      subscription.remove();
    };
  }

  async readSpeedRange(): Promise<BleOperationResult<SupportedSpeedRange>> {
    if (!this.connectedDevice) {
      return bleError('No device connected');
    }

    try {
      const characteristic =
        await this.connectedDevice.readCharacteristicForService(
          FITNESS_MACHINE_SERVICE_UUID,
          FtmsCharacteristics.SUPPORTED_SPEED_RANGE,
        );

      if (!characteristic.value) {
        return bleError('No data received');
      }

      const bytes = base64ToBytes(characteristic.value);
      const range = parseSupportedSpeedRange(bytes);
      return bleSuccess(range);
    } catch (error) {
      return bleError(
        error instanceof Error ? error.message : 'Failed to read speed range',
      );
    }
  }

  async requestControl(): Promise<BleOperationResult<void>> {
    return this.writeControlCommand(buildRequestControlCommand());
  }

  async sendStartCommand(): Promise<BleOperationResult<void>> {
    return this.writeControlCommand(buildStartCommand());
  }

  async sendStopCommand(): Promise<BleOperationResult<void>> {
    return this.writeControlCommand(buildStopCommand());
  }

  async sendPauseCommand(): Promise<BleOperationResult<void>> {
    return this.writeControlCommand(buildPauseCommand());
  }

  async setTargetSpeed(speedKmh: number): Promise<BleOperationResult<void>> {
    return this.writeControlCommand(buildSetTargetSpeedCommand(speedKmh));
  }

  private async writeControlCommand(
    command: Uint8Array,
  ): Promise<BleOperationResult<void>> {
    if (!this.connectedDevice) {
      return bleError('No device connected');
    }

    try {
      await this.connectedDevice.writeCharacteristicWithResponseForService(
        FITNESS_MACHINE_SERVICE_UUID,
        FtmsCharacteristics.FITNESS_MACHINE_CONTROL_POINT,
        bytesToBase64(command),
      );
      return bleSuccess(undefined);
    } catch (error) {
      return bleError(
        error instanceof Error ? error.message : 'Command failed',
      );
    }
  }

  private setConnectionState(state: ConnectionState): void {
    this.connectionState = state;
    this.connectionStateCallbacks.forEach(cb => cb(state));
  }
}
