import {
  HealthPlatform,
  HealthAuthStatus,
  HealthDataType,
  HealthOperationResult,
  HealthWorkoutData,
} from './HealthTypes';
import {HealthService, healthSuccess, healthError} from './HealthService';

/**
 * Mock implementation of HealthService for testing.
 */
export class MockHealthService implements HealthService {
  private platform: HealthPlatform = HealthPlatform.AppleHealth;
  private authStatus: HealthAuthStatus = HealthAuthStatus.NotDetermined;
  private workouts: HealthWorkoutData[] = [];
  private shouldFail: boolean = false;
  private failureMessage: string = 'Mock health service error';

  // Test helpers
  setAvailablePlatform(platform: HealthPlatform): void {
    this.platform = platform;
  }

  setAuthorizationStatus(status: HealthAuthStatus): void {
    this.authStatus = status;
  }

  setShouldFail(shouldFail: boolean, message?: string): void {
    this.shouldFail = shouldFail;
    if (message) {
      this.failureMessage = message;
    }
  }

  addWorkout(workout: HealthWorkoutData): void {
    this.workouts.push(workout);
  }

  clearWorkouts(): void {
    this.workouts = [];
  }

  getStoredWorkouts(): HealthWorkoutData[] {
    return [...this.workouts];
  }

  // HealthService implementation
  getAvailablePlatform(): HealthPlatform {
    return this.platform;
  }

  isAvailable(): boolean {
    return this.platform !== HealthPlatform.None;
  }

  async getAuthorizationStatus(): Promise<HealthAuthStatus> {
    return this.authStatus;
  }

  async requestAuthorization(
    _dataTypes: HealthDataType[],
  ): Promise<HealthOperationResult<void>> {
    if (this.shouldFail) {
      return healthError(this.failureMessage);
    }

    if (this.platform === HealthPlatform.None) {
      return healthError('No health platform available');
    }

    this.authStatus = HealthAuthStatus.Authorized;
    return healthSuccess(undefined);
  }

  async saveWorkout(
    workout: HealthWorkoutData,
  ): Promise<HealthOperationResult<void>> {
    if (this.shouldFail) {
      return healthError(this.failureMessage);
    }

    if (this.authStatus !== HealthAuthStatus.Authorized) {
      return healthError('Not authorized to save workouts');
    }

    this.workouts.push(workout);
    return healthSuccess(undefined);
  }

  async deleteWorkout(startTime: Date): Promise<HealthOperationResult<void>> {
    if (this.shouldFail) {
      return healthError(this.failureMessage);
    }

    if (this.authStatus !== HealthAuthStatus.Authorized) {
      return healthError('Not authorized to delete workouts');
    }

    const index = this.workouts.findIndex(
      w => w.startTime.getTime() === startTime.getTime(),
    );

    if (index === -1) {
      return healthError('Workout not found');
    }

    this.workouts.splice(index, 1);
    return healthSuccess(undefined);
  }

  async getWorkouts(
    startDate: Date,
    endDate: Date,
  ): Promise<HealthOperationResult<HealthWorkoutData[]>> {
    if (this.shouldFail) {
      return healthError(this.failureMessage);
    }

    if (this.authStatus !== HealthAuthStatus.Authorized) {
      return healthError('Not authorized to read workouts');
    }

    const filtered = this.workouts.filter(
      w =>
        w.startTime.getTime() >= startDate.getTime() &&
        w.endTime.getTime() <= endDate.getTime(),
    );

    return healthSuccess(filtered);
  }
}
