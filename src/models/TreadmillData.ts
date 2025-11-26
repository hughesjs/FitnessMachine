/**
 * Represents real-time data from a connected treadmill.
 * Values are streamed via BLE notifications.
 */
export interface TreadmillData {
  /** Current speed in kilometers per hour */
  readonly speedInKmh: number;
  /** Total distance covered in kilometers */
  readonly distanceInKm: number;
  /** Elapsed workout time in seconds */
  readonly timeInSeconds: number;
  /** Calories burned as indicated by the machine */
  readonly indicatedKiloCalories: number;
  /** Total steps counted */
  readonly steps: number;
}

/**
 * Validation rules for treadmill data bounds.
 */
interface TreadmillDataValidationRules {
  maxSpeedKmh: number;
  maxDistanceKm: number;
  maxTimeSeconds: number;
  maxCalories: number;
  maxSteps: number;
}

const DEFAULT_VALIDATION_RULES: TreadmillDataValidationRules = {
  maxSpeedKmh: 30,
  maxDistanceKm: 999.99,
  maxTimeSeconds: 86400,
  maxCalories: 99999,
  maxSteps: 999999,
};

/**
 * Validates and clamps a value to a safe range.
 */
function validateAndClamp(
  value: number,
  min: number,
  max: number,
  fieldName: string,
): number {
  if (isNaN(value) || !isFinite(value)) {
    console.warn(`Invalid ${fieldName}: ${value}, using 0`);
    return 0;
  }

  if (value < min) {
    console.warn(`${fieldName} below minimum: ${value}, clamping to ${min}`);
    return min;
  }

  if (value > max) {
    console.warn(`${fieldName} above maximum: ${value}, clamping to ${max}`);
    return max;
  }

  return value;
}

/**
 * Creates a TreadmillData object with default zero values.
 */
export function createEmptyTreadmillData(): TreadmillData {
  return {
    speedInKmh: 0,
    distanceInKm: 0,
    timeInSeconds: 0,
    indicatedKiloCalories: 0,
    steps: 0,
  };
}

/**
 * Parses treadmill data from raw BLE characteristic bytes.
 * Based on FTMS (Fitness Machine Service) Treadmill Data characteristic.
 *
 * Byte layout:
 * - Bytes 0-1: Flags
 * - Bytes 2-3: Instantaneous Speed (uint16, 0.01 km/h resolution)
 * - Bytes 4-5: Total Distance (uint16, meters) - if flag bit set
 * - Other fields based on flags
 */
export function parseTreadmillData(bytes: Uint8Array): TreadmillData {
  if (bytes.length < 4) {
    console.warn('Treadmill data too short:', bytes.length);
    return createEmptyTreadmillData();
  }

  // Speed is always present at bytes 2-3 (uint16, little-endian, 0.01 km/h resolution)
  const speedRaw = (bytes[2] ?? 0) | ((bytes[3] ?? 0) << 8);
  const speedInKmh = validateAndClamp(
    speedRaw / 100,
    0,
    DEFAULT_VALIDATION_RULES.maxSpeedKmh,
    'speed',
  );

  let offset = 4;
  let distanceInKm = 0;
  let timeInSeconds = 0;
  let indicatedKiloCalories = 0;
  let steps = 0;

  // Read flags from bytes 0-1
  const flags = (bytes[0] ?? 0) | ((bytes[1] ?? 0) << 8);

  // Bit 0: More Data (inverted - 0 means more data present)
  // Bit 1: Average Speed Present
  if (flags & 0x0002) {
    offset += 2; // Skip average speed
  }

  // Bit 2: Total Distance Present (24-bit)
  if (flags & 0x0004) {
    if (bytes.length >= offset + 3) {
      const distanceMeters =
        (bytes[offset] ?? 0) |
        ((bytes[offset + 1] ?? 0) << 8) |
        ((bytes[offset + 2] ?? 0) << 16);
      distanceInKm = validateAndClamp(
        distanceMeters / 1000,
        0,
        DEFAULT_VALIDATION_RULES.maxDistanceKm,
        'distance',
      );
      offset += 3;
    }
  }

  // Bit 3: Inclination and Ramp Angle Present
  if (flags & 0x0008) {
    offset += 4; // Skip inclination (2) + ramp angle (2)
  }

  // Bit 4: Elevation Gain Present
  if (flags & 0x0010) {
    offset += 4; // Skip positive (2) + negative (2) elevation gain
  }

  // Bit 5: Instantaneous Pace Present
  if (flags & 0x0020) {
    offset += 1; // Skip pace
  }

  // Bit 6: Average Pace Present
  if (flags & 0x0040) {
    offset += 1; // Skip average pace
  }

  // Bit 7: Expended Energy Present
  if (flags & 0x0080) {
    if (bytes.length >= offset + 5) {
      const caloriesRaw = (bytes[offset] ?? 0) | ((bytes[offset + 1] ?? 0) << 8);
      indicatedKiloCalories = validateAndClamp(
        caloriesRaw,
        0,
        DEFAULT_VALIDATION_RULES.maxCalories,
        'calories',
      );
      offset += 5; // Total (2) + per hour (2) + per minute (1)
    }
  }

  // Bit 8: Heart Rate Present
  if (flags & 0x0100) {
    offset += 1; // Skip heart rate
  }

  // Bit 9: Metabolic Equivalent Present
  if (flags & 0x0200) {
    offset += 1; // Skip MET
  }

  // Bit 10: Elapsed Time Present
  if (flags & 0x0400) {
    if (bytes.length >= offset + 2) {
      const timeRaw = (bytes[offset] ?? 0) | ((bytes[offset + 1] ?? 0) << 8);
      timeInSeconds = validateAndClamp(
        timeRaw,
        0,
        DEFAULT_VALIDATION_RULES.maxTimeSeconds,
        'time',
      );
      offset += 2;
    }
  }

  // Bit 11: Remaining Time Present
  if (flags & 0x0800) {
    offset += 2; // Skip remaining time
  }

  // Bit 12: Force on Belt and Power Output Present
  if (flags & 0x1000) {
    offset += 4; // Skip force (2) + power (2)
  }

  // Step count is often at a fixed position or encoded differently
  // Some devices use a vendor-specific position
  // Check if we have additional bytes that might contain step data
  if (bytes.length >= offset + 2) {
    const stepsRaw = (bytes[offset] ?? 0) | ((bytes[offset + 1] ?? 0) << 8);
    steps = validateAndClamp(
      stepsRaw,
      0,
      DEFAULT_VALIDATION_RULES.maxSteps,
      'steps',
    );
  }

  return {
    speedInKmh,
    distanceInKm,
    timeInSeconds,
    indicatedKiloCalories,
    steps,
  };
}

/**
 * Formats time in seconds to HH:MM:SS string.
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formats distance in km to a display string.
 */
export function formatDistance(distanceKm: number): string {
  return distanceKm.toFixed(2);
}
