// BLE Service exports

export {type BleService, bleSuccess, bleError} from './BleService';
export {BleServiceImpl} from './BleServiceImpl';
export {MockBleService} from './MockBleService';

export {
  BluetoothState,
  ConnectionState,
  type BleOperationResult,
  type BluetoothStateCallback,
  type DeviceDiscoveryCallback,
  type ConnectionStateCallback,
  type CharacteristicUpdateCallback,
  type ConnectedFitnessMachine,
  createConnectedFitnessMachine,
  isBluetoothReady,
  getBluetoothStateMessage,
  getConnectionStateMessage,
} from './BleTypes';

export {
  buildRequestControlCommand,
  buildResetCommand,
  buildSetTargetSpeedCommand,
  buildStartCommand,
  buildStopCommand,
  buildPauseCommand,
  buildSetTargetDistanceCommand,
  buildSetTargetTimeCommand,
  buildSetTargetStepsCommand,
  parseControlPointResponse,
} from './FtmsCommands';

export {
  FITNESS_MACHINE_SERVICE_UUID,
  FITNESS_MACHINE_SERVICE_UUID_SHORT,
  FtmsCharacteristics,
  FtmsOpcodes,
  StopPauseParams,
  FtmsResultCodes,
} from './constants';
