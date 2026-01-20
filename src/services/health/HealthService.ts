import {
  HealthPlatform,
  HealthAuthStatus,
  HealthDataType,
  HealthOperationResult,
  HealthWorkoutData,
} from './HealthTypes';

/**
 * Interface for health platform integration.
 * Abstracts the platform-specific health APIs (HealthKit, Google Fit).
 */
export interface HealthService {
  /**
   * Get the available health platform.
   * Returns None if no health platform is available.
   */
  getAvailablePlatform(): HealthPlatform;

  /**
   * Check if health data sync is available.
   */
  isAvailable(): boolean;

  /**
   * Get the current authorization status.
   */
  getAuthorizationStatus(): Promise<HealthAuthStatus>;

  /**
   * Request authorization for reading and writing health data.
   * @param dataTypes The types of data to request access for
   */
  requestAuthorization(dataTypes: HealthDataType[]): Promise<HealthOperationResult<void>>;

  /**
   * Save a workout to the health platform.
   * @param workout The workout data to save
   */
  saveWorkout(workout: HealthWorkoutData): Promise<HealthOperationResult<void>>;

  /**
   * Delete a workout from the health platform.
   * @param startTime The start time of the workout to delete
   */
  deleteWorkout(startTime: Date): Promise<HealthOperationResult<void>>;

  /**
   * Get workouts from the health platform in a date range.
   * @param startDate Start of the range
   * @param endDate End of the range
   */
  getWorkouts(startDate: Date, endDate: Date): Promise<HealthOperationResult<HealthWorkoutData[]>>;
}

/**
 * Creates a successful health operation result.
 */
export function healthSuccess<T>(data: T): HealthOperationResult<T> {
  return {success: true, data};
}

/**
 * Creates a failed health operation result.
 */
export function healthError<T>(error: string): HealthOperationResult<T> {
  return {success: false, error};
}
