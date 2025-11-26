/**
 * FTMS (Fitness Machine Service) Bluetooth UUIDs.
 * Based on the Bluetooth SIG FTMS specification.
 */

/** Fitness Machine Service UUID */
export const FITNESS_MACHINE_SERVICE_UUID = '00001826-0000-1000-8000-00805f9b34fb';

/** Short form (16-bit) for service matching */
export const FITNESS_MACHINE_SERVICE_UUID_SHORT = '1826';

/**
 * FTMS Characteristic UUIDs
 */
export const FtmsCharacteristics = {
  /** Fitness Machine Feature - describes supported features (read) */
  FITNESS_MACHINE_FEATURE: '00002acc-0000-1000-8000-00805f9b34fb',

  /** Treadmill Data - real-time workout data (notify) */
  TREADMILL_DATA: '00002acd-0000-1000-8000-00805f9b34fb',

  /** Training Status - current training state (read, notify) */
  TRAINING_STATUS: '00002ad3-0000-1000-8000-00805f9b34fb',

  /** Fitness Machine Status - machine status changes (notify) */
  FITNESS_MACHINE_STATUS: '00002ada-0000-1000-8000-00805f9b34fb',

  /** Supported Speed Range - min/max/increment speed (read) */
  SUPPORTED_SPEED_RANGE: '00002ad4-0000-1000-8000-00805f9b34fb',

  /** Fitness Machine Control Point - send commands (write, indicate) */
  FITNESS_MACHINE_CONTROL_POINT: '00002ad9-0000-1000-8000-00805f9b34fb',
} as const;

/**
 * Type for FTMS characteristic UUIDs
 */
export type FtmsCharacteristicUuid =
  (typeof FtmsCharacteristics)[keyof typeof FtmsCharacteristics];
