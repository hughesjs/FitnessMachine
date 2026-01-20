import {FtmsOpcodes, StopPauseParams} from './constants';

/**
 * Builds FTMS control point commands as byte arrays.
 * These commands are written to the Fitness Machine Control Point characteristic.
 */

/**
 * Builds a command to request control of the fitness machine.
 * This must be sent before any other control commands.
 */
export function buildRequestControlCommand(): Uint8Array {
  return new Uint8Array([FtmsOpcodes.REQUEST_CONTROL]);
}

/**
 * Builds a command to reset the fitness machine.
 */
export function buildResetCommand(): Uint8Array {
  return new Uint8Array([FtmsOpcodes.RESET]);
}

/**
 * Builds a command to set the target speed.
 * @param speedKmh Speed in km/h (will be converted to 0.01 km/h units)
 */
export function buildSetTargetSpeedCommand(speedKmh: number): Uint8Array {
  // Speed is in 0.01 km/h units, stored as uint16 little-endian
  const speedUnits = Math.round(speedKmh * 100);
  const lowByte = speedUnits & 0xff;
  const highByte = (speedUnits >> 8) & 0xff;

  return new Uint8Array([FtmsOpcodes.SET_TARGET_SPEED, lowByte, highByte]);
}

/**
 * Builds a command to start or resume the workout.
 */
export function buildStartCommand(): Uint8Array {
  return new Uint8Array([FtmsOpcodes.START_OR_RESUME]);
}

/**
 * Builds a command to stop the workout.
 */
export function buildStopCommand(): Uint8Array {
  return new Uint8Array([FtmsOpcodes.STOP_OR_PAUSE, StopPauseParams.STOP]);
}

/**
 * Builds a command to pause the workout.
 */
export function buildPauseCommand(): Uint8Array {
  return new Uint8Array([FtmsOpcodes.STOP_OR_PAUSE, StopPauseParams.PAUSE]);
}

/**
 * Builds a command to set target distance.
 * @param distanceMeters Target distance in meters (uint24)
 */
export function buildSetTargetDistanceCommand(
  distanceMeters: number,
): Uint8Array {
  // Distance is in meters, stored as uint24 little-endian
  const distance = Math.round(distanceMeters);
  const byte0 = distance & 0xff;
  const byte1 = (distance >> 8) & 0xff;
  const byte2 = (distance >> 16) & 0xff;

  return new Uint8Array([FtmsOpcodes.SET_TARGET_DISTANCE, byte0, byte1, byte2]);
}

/**
 * Builds a command to set target training time.
 * @param seconds Target time in seconds (uint16)
 */
export function buildSetTargetTimeCommand(seconds: number): Uint8Array {
  // Time is in seconds, stored as uint16 little-endian
  const time = Math.round(seconds);
  const lowByte = time & 0xff;
  const highByte = (time >> 8) & 0xff;

  return new Uint8Array([
    FtmsOpcodes.SET_TARGET_TRAINING_TIME,
    lowByte,
    highByte,
  ]);
}

/**
 * Builds a command to set target steps.
 * @param steps Target number of steps (uint16)
 */
export function buildSetTargetStepsCommand(steps: number): Uint8Array {
  const stepCount = Math.round(steps);
  const lowByte = stepCount & 0xff;
  const highByte = (stepCount >> 8) & 0xff;

  return new Uint8Array([FtmsOpcodes.SET_TARGET_STEPS, lowByte, highByte]);
}

/**
 * Parses a response from the control point characteristic.
 * @param data The response bytes
 * @returns The result code and original opcode, or null if invalid
 */
export function parseControlPointResponse(
  data: Uint8Array,
): {opcode: number; requestOpcode: number; resultCode: number} | null {
  if (data.length < 3) {
    return null;
  }

  const opcode = data[0];
  if (opcode !== FtmsOpcodes.RESPONSE_CODE) {
    return null;
  }

  return {
    opcode: opcode,
    requestOpcode: data[1] ?? 0,
    resultCode: data[2] ?? 0,
  };
}
