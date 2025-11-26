/**
 * Represents the supported speed range of a fitness machine.
 * Parsed from FTMS Supported Speed Range characteristic.
 */
export interface SupportedSpeedRange {
  /** Minimum supported speed in km/h */
  readonly minSpeedInKmh: number;
  /** Maximum supported speed in km/h */
  readonly maxSpeedInKmh: number;
  /** Minimum speed increment in km/h */
  readonly minIncrementInKmh: number;
}

/**
 * Default speed range used when device doesn't provide one.
 */
export const DEFAULT_SPEED_RANGE: SupportedSpeedRange = {
  minSpeedInKmh: 0.5,
  maxSpeedInKmh: 12.0,
  minIncrementInKmh: 0.1,
};

/**
 * Parses supported speed range from raw BLE characteristic bytes.
 *
 * Byte layout (FTMS Supported Speed Range characteristic 0x2AD4):
 * - Bytes 0-1: Minimum Speed (uint16, 0.01 km/h resolution)
 * - Bytes 2-3: Maximum Speed (uint16, 0.01 km/h resolution)
 * - Bytes 4-5: Minimum Increment (uint16, 0.01 km/h resolution)
 */
export function parseSupportedSpeedRange(
  bytes: Uint8Array,
): SupportedSpeedRange {
  if (bytes.length < 6) {
    return DEFAULT_SPEED_RANGE;
  }

  const minSpeedRaw = (bytes[0] ?? 0) | ((bytes[1] ?? 0) << 8);
  const maxSpeedRaw = (bytes[2] ?? 0) | ((bytes[3] ?? 0) << 8);
  const incrementRaw = (bytes[4] ?? 0) | ((bytes[5] ?? 0) << 8);

  return {
    minSpeedInKmh: minSpeedRaw / 100,
    maxSpeedInKmh: maxSpeedRaw / 100,
    minIncrementInKmh: incrementRaw / 100,
  };
}

/**
 * Validates that a speed value is within the supported range.
 */
export function isSpeedInRange(
  speed: number,
  range: SupportedSpeedRange,
): boolean {
  return speed >= range.minSpeedInKmh && speed <= range.maxSpeedInKmh;
}

/**
 * Clamps a speed value to the supported range.
 */
export function clampSpeed(
  speed: number,
  range: SupportedSpeedRange,
): number {
  return Math.max(range.minSpeedInKmh, Math.min(range.maxSpeedInKmh, speed));
}

/**
 * Rounds a speed value to the nearest valid increment.
 */
export function roundToIncrement(
  speed: number,
  range: SupportedSpeedRange,
): number {
  const increment = range.minIncrementInKmh;
  if (increment <= 0) {
    return speed;
  }
  return Math.round(speed / increment) * increment;
}
