import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import {
  DeviceDescriptor,
  TreadmillData,
  SupportedSpeedRange,
  createEmptyTreadmillData,
  DEFAULT_SPEED_RANGE,
} from '../models';
import {
  BleService,
  BluetoothState,
  ConnectionState,
  ConnectedFitnessMachine,
} from '../services/ble';

/**
 * State provided by the BLE context.
 */
interface BleContextState {
  /** Current Bluetooth adapter state */
  bluetoothState: BluetoothState;
  /** Whether Bluetooth is ready for use */
  isBluetoothReady: boolean;
  /** Current connection state */
  connectionState: ConnectionState;
  /** Whether we're connected to a device */
  isConnected: boolean;
  /** The currently connected device, if any */
  connectedDevice: ConnectedFitnessMachine | null;
  /** Whether we're currently scanning for devices */
  isScanning: boolean;
  /** Discovered devices during scanning */
  discoveredDevices: DeviceDescriptor[];
  /** Latest treadmill data from the connected device */
  treadmillData: TreadmillData;
  /** Supported speed range from the connected device */
  speedRange: SupportedSpeedRange;
  /** Error message if any operation failed */
  error: string | null;
}

/**
 * Actions provided by the BLE context.
 */
interface BleContextActions {
  /** Start scanning for fitness machine devices */
  startScan: () => void;
  /** Stop scanning for devices */
  stopScan: () => void;
  /** Connect to a device */
  connectToDevice: (device: DeviceDescriptor) => Promise<boolean>;
  /** Disconnect from the current device */
  disconnect: () => Promise<void>;
  /** Request control of the fitness machine */
  requestControl: () => Promise<boolean>;
  /** Start/resume the workout */
  startWorkout: () => Promise<boolean>;
  /** Stop the workout */
  stopWorkout: () => Promise<boolean>;
  /** Pause the workout */
  pauseWorkout: () => Promise<boolean>;
  /** Set target speed */
  setTargetSpeed: (speedKmh: number) => Promise<boolean>;
  /** Clear error */
  clearError: () => void;
}

export type BleContextValue = BleContextState & BleContextActions;

export const BleContext = createContext<BleContextValue | null>(null);

interface BleProviderProps {
  children: ReactNode;
  bleService: BleService;
}

/**
 * Provider component for BLE functionality.
 */
export function BleProvider({children, bleService}: BleProviderProps): React.JSX.Element {
  const [bluetoothState, setBluetoothState] = useState<BluetoothState>(
    BluetoothState.Unknown,
  );
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.Disconnected,
  );
  const [connectedDevice, setConnectedDevice] =
    useState<ConnectedFitnessMachine | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<DeviceDescriptor[]>([]);
  const [treadmillData, setTreadmillData] = useState<TreadmillData>(
    createEmptyTreadmillData(),
  );
  const [speedRange, setSpeedRange] =
    useState<SupportedSpeedRange>(DEFAULT_SPEED_RANGE);
  const [error, setError] = useState<string | null>(null);

  const treadmillDataUnsubscribeRef = useRef<(() => void) | null>(null);

  // Initialize BLE service
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        await bleService.initialize();
        if (mounted) {
          setBluetoothState(bleService.getBluetoothState());
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : 'Failed to initialize Bluetooth',
          );
        }
      }
    };

    init();

    // Subscribe to state changes
    const unsubBluetooth = bleService.onBluetoothStateChange(state => {
      if (mounted) {
        setBluetoothState(state);
      }
    });

    const unsubConnection = bleService.onConnectionStateChange(state => {
      if (mounted) {
        setConnectionState(state);
        if (state === ConnectionState.Disconnected) {
          setConnectedDevice(null);
          setTreadmillData(createEmptyTreadmillData());
        }
      }
    });

    return () => {
      mounted = false;
      unsubBluetooth();
      unsubConnection();
      bleService.destroy();
    };
  }, [bleService]);

  const startScan = useCallback(() => {
    setDiscoveredDevices([]);
    setIsScanning(true);
    setError(null);

    bleService.startScan(device => {
      setDiscoveredDevices(prev => {
        // Avoid duplicates
        if (prev.some(d => d.deviceId === device.deviceId)) {
          return prev;
        }
        return [...prev, device];
      });
    });
  }, [bleService]);

  const stopScan = useCallback(() => {
    bleService.stopScan();
    setIsScanning(false);
  }, [bleService]);

  const connectToDevice = useCallback(
    async (device: DeviceDescriptor): Promise<boolean> => {
      setError(null);
      stopScan();

      const result = await bleService.connect(device);

      if (!result.success) {
        setError(result.error);
        return false;
      }

      setConnectedDevice(result.data);

      // Read speed range
      const rangeResult = await bleService.readSpeedRange();
      if (rangeResult.success) {
        setSpeedRange(rangeResult.data);
      } else {
        console.warn('Failed to read speed range, using defaults. Speed control may not work correctly.');
        setError('Warning: Could not read device speed range. Speed control may be limited.');
        setSpeedRange(DEFAULT_SPEED_RANGE);
      }

      // Subscribe to treadmill data
      const unsubscribe = await bleService.subscribeTreadmillData(data => {
        setTreadmillData(data);
      });
      treadmillDataUnsubscribeRef.current = unsubscribe;

      return true;
    },
    [bleService, stopScan],
  );

  const disconnect = useCallback(async (): Promise<void> => {
    if (treadmillDataUnsubscribeRef.current) {
      treadmillDataUnsubscribeRef.current();
      treadmillDataUnsubscribeRef.current = null;
    }
    await bleService.disconnect();
    setConnectedDevice(null);
    setTreadmillData(createEmptyTreadmillData());
    setSpeedRange(DEFAULT_SPEED_RANGE);
  }, [bleService]);

  const requestControl = useCallback(async (): Promise<boolean> => {
    const result = await bleService.requestControl();
    if (!result.success) {
      setError(result.error);
      return false;
    }
    return true;
  }, [bleService]);

  const startWorkout = useCallback(async (): Promise<boolean> => {
    const result = await bleService.sendStartCommand();
    if (!result.success) {
      setError(result.error);
      return false;
    }
    return true;
  }, [bleService]);

  const stopWorkout = useCallback(async (): Promise<boolean> => {
    const result = await bleService.sendStopCommand();
    if (!result.success) {
      setError(result.error);
      return false;
    }
    return true;
  }, [bleService]);

  const pauseWorkout = useCallback(async (): Promise<boolean> => {
    const result = await bleService.sendPauseCommand();
    if (!result.success) {
      setError(result.error);
      return false;
    }
    return true;
  }, [bleService]);

  const setTargetSpeed = useCallback(
    async (speedKmh: number): Promise<boolean> => {
      const result = await bleService.setTargetSpeed(speedKmh);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      return true;
    },
    [bleService],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: BleContextValue = {
    bluetoothState,
    isBluetoothReady: bluetoothState === BluetoothState.PoweredOn,
    connectionState,
    isConnected: connectionState === ConnectionState.Connected,
    connectedDevice,
    isScanning,
    discoveredDevices,
    treadmillData,
    speedRange,
    error,
    startScan,
    stopScan,
    connectToDevice,
    disconnect,
    requestControl,
    startWorkout,
    stopWorkout,
    pauseWorkout,
    setTargetSpeed,
    clearError,
  };

  return <BleContext.Provider value={value}>{children}</BleContext.Provider>;
}

/**
 * Hook to access BLE context.
 */
export function useBle(): BleContextValue {
  const context = useContext(BleContext);
  if (!context) {
    throw new Error('useBle must be used within a BleProvider');
  }
  return context;
}
