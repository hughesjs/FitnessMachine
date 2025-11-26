/**
 * FTMS Control Point Opcodes.
 * These are the command codes sent to the Fitness Machine Control Point characteristic.
 */
export const FtmsOpcodes = {
  /** Request control of the fitness machine */
  REQUEST_CONTROL: 0x00,

  /** Reset the fitness machine */
  RESET: 0x01,

  /** Set the target speed */
  SET_TARGET_SPEED: 0x02,

  /** Set the target inclination */
  SET_TARGET_INCLINATION: 0x03,

  /** Set the target resistance level */
  SET_TARGET_RESISTANCE_LEVEL: 0x04,

  /** Set the target power */
  SET_TARGET_POWER: 0x05,

  /** Set the target heart rate */
  SET_TARGET_HEART_RATE: 0x06,

  /** Start or resume the workout */
  START_OR_RESUME: 0x07,

  /** Stop or pause the workout */
  STOP_OR_PAUSE: 0x08,

  /** Set the target expended energy */
  SET_TARGET_EXPENDED_ENERGY: 0x09,

  /** Set the target number of steps */
  SET_TARGET_STEPS: 0x0a,

  /** Set the target number of strides */
  SET_TARGET_STRIDES: 0x0b,

  /** Set the target distance */
  SET_TARGET_DISTANCE: 0x0c,

  /** Set the target training time */
  SET_TARGET_TRAINING_TIME: 0x0d,

  /** Set indoor bike simulation parameters */
  SET_INDOOR_BIKE_SIMULATION: 0x11,

  /** Set wheel circumference */
  SET_WHEEL_CIRCUMFERENCE: 0x12,

  /** Spin down control */
  SPIN_DOWN_CONTROL: 0x13,

  /** Set targeted cadence */
  SET_TARGETED_CADENCE: 0x14,

  /** Response code from device */
  RESPONSE_CODE: 0x80,
} as const;

/**
 * Type for FTMS opcodes
 */
export type FtmsOpcode = (typeof FtmsOpcodes)[keyof typeof FtmsOpcodes];

/**
 * Stop/Pause parameter values for STOP_OR_PAUSE opcode
 */
export const StopPauseParams = {
  /** Stop the workout */
  STOP: 0x01,
  /** Pause the workout */
  PAUSE: 0x02,
} as const;

/**
 * Result codes from the fitness machine
 */
export const FtmsResultCodes = {
  /** Operation completed successfully */
  SUCCESS: 0x01,
  /** Opcode not supported */
  OPCODE_NOT_SUPPORTED: 0x02,
  /** Invalid parameter */
  INVALID_PARAMETER: 0x03,
  /** Operation failed */
  OPERATION_FAILED: 0x04,
  /** Control not permitted */
  CONTROL_NOT_PERMITTED: 0x05,
} as const;

export type FtmsResultCode =
  (typeof FtmsResultCodes)[keyof typeof FtmsResultCodes];
