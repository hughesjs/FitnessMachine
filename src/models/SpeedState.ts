import {SupportedSpeedRange, DEFAULT_SPEED_RANGE} from './SupportedSpeedRange';

/**
 * Represents the current speed state including the actual speed
 * and the valid range for the connected device.
 */
export interface SpeedState {
  /** Current target speed in km/h */
  readonly speedInKmh: number;
  /** Minimum allowed speed in km/h */
  readonly minSpeed: number;
  /** Maximum allowed speed in km/h */
  readonly maxSpeed: number;
}

/**
 * Creates a SpeedState from a speed value and supported range.
 */
export function createSpeedState(
  speedInKmh: number,
  range: SupportedSpeedRange = DEFAULT_SPEED_RANGE,
): SpeedState {
  return {
    speedInKmh,
    minSpeed: range.minSpeedInKmh,
    maxSpeed: range.maxSpeedInKmh,
  };
}

/**
 * Creates an initial speed state with default values.
 */
export function createInitialSpeedState(): SpeedState {
  return {
    speedInKmh: 0,
    minSpeed: DEFAULT_SPEED_RANGE.minSpeedInKmh,
    maxSpeed: DEFAULT_SPEED_RANGE.maxSpeedInKmh,
  };
}

/**
 * Calculates the speed as a percentage of the range (0-1).
 */
export function getSpeedPercentage(state: SpeedState): number {
  const range = state.maxSpeed - state.minSpeed;
  if (range <= 0) {
    return 0;
  }
  const percentage = (state.speedInKmh - state.minSpeed) / range;
  return Math.max(0, Math.min(1, percentage));
}

/**
 * Checks if speed can be increased.
 */
export function canIncreaseSpeed(state: SpeedState): boolean {
  return state.speedInKmh < state.maxSpeed;
}

/**
 * Checks if speed can be decreased.
 */
export function canDecreaseSpeed(state: SpeedState): boolean {
  return state.speedInKmh > state.minSpeed;
}
