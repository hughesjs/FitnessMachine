/**
 * Health platform availability status
 */
export enum HealthPlatform {
  None = 'None',
  AppleHealth = 'AppleHealth',
  GoogleFit = 'GoogleFit',
}

/**
 * Authorization status for health data access
 */
export enum HealthAuthStatus {
  Unknown = 'Unknown',
  NotDetermined = 'NotDetermined',
  Denied = 'Denied',
  Authorized = 'Authorized',
}

/**
 * Types of health data we can sync
 */
export enum HealthDataType {
  Workout = 'Workout',
  Steps = 'Steps',
  Distance = 'Distance',
  ActiveEnergy = 'ActiveEnergy',
  HeartRate = 'HeartRate',
}

/**
 * Workout types for health platforms
 */
export enum HealthWorkoutType {
  Walking = 'Walking',
  Running = 'Running',
  Treadmill = 'Treadmill',
  Other = 'Other',
}

/**
 * Result of a health operation
 */
export type HealthOperationResult<T> =
  | {success: true; data: T}
  | {success: false; error: string};

/**
 * Data for syncing a workout to health platforms
 */
export interface HealthWorkoutData {
  /** Start time of the workout */
  readonly startTime: Date;
  /** End time of the workout */
  readonly endTime: Date;
  /** Type of workout */
  readonly workoutType: HealthWorkoutType;
  /** Total energy burned in kilocalories */
  readonly energyBurned: number;
  /** Total distance in kilometers */
  readonly distanceKm: number;
  /** Total steps taken */
  readonly steps: number;
}

/**
 * Creates a HealthWorkoutData from workout parameters
 */
export function createHealthWorkoutData(params: {
  startTime: Date;
  endTime: Date;
  workoutType: HealthWorkoutType;
  energyBurned: number;
  distanceKm: number;
  steps: number;
}): HealthWorkoutData {
  return {
    startTime: params.startTime,
    endTime: params.endTime,
    workoutType: params.workoutType,
    energyBurned: params.energyBurned,
    distanceKm: params.distanceKm,
    steps: params.steps,
  };
}

/**
 * Gets the health platform name for display
 */
export function getHealthPlatformName(platform: HealthPlatform): string {
  switch (platform) {
    case HealthPlatform.AppleHealth:
      return 'Apple Health';
    case HealthPlatform.GoogleFit:
      return 'Google Fit';
    case HealthPlatform.None:
    default:
      return 'None';
  }
}

/**
 * Gets a user-friendly message for the auth status
 */
export function getAuthStatusMessage(status: HealthAuthStatus): string {
  switch (status) {
    case HealthAuthStatus.Authorized:
      return 'Access granted';
    case HealthAuthStatus.Denied:
      return 'Access denied - check settings';
    case HealthAuthStatus.NotDetermined:
      return 'Permission not requested';
    case HealthAuthStatus.Unknown:
    default:
      return 'Unknown status';
  }
}
