import {MockHealthService} from '../MockHealthService';
import {
  HealthPlatform,
  HealthAuthStatus,
  HealthDataType,
  HealthWorkoutType,
  createHealthWorkoutData,
} from '../HealthTypes';

describe('MockHealthService', () => {
  let healthService: MockHealthService;

  beforeEach(() => {
    healthService = new MockHealthService();
  });

  describe('getAvailablePlatform', () => {
    it('returns AppleHealth by default', () => {
      expect(healthService.getAvailablePlatform()).toBe(HealthPlatform.AppleHealth);
    });

    it('returns the set platform', () => {
      healthService.setAvailablePlatform(HealthPlatform.GoogleFit);
      expect(healthService.getAvailablePlatform()).toBe(HealthPlatform.GoogleFit);
    });
  });

  describe('isAvailable', () => {
    it('returns true when platform is available', () => {
      expect(healthService.isAvailable()).toBe(true);
    });

    it('returns false when platform is None', () => {
      healthService.setAvailablePlatform(HealthPlatform.None);
      expect(healthService.isAvailable()).toBe(false);
    });
  });

  describe('getAuthorizationStatus', () => {
    it('returns NotDetermined by default', async () => {
      const status = await healthService.getAuthorizationStatus();
      expect(status).toBe(HealthAuthStatus.NotDetermined);
    });

    it('returns the set status', async () => {
      healthService.setAuthorizationStatus(HealthAuthStatus.Authorized);
      const status = await healthService.getAuthorizationStatus();
      expect(status).toBe(HealthAuthStatus.Authorized);
    });
  });

  describe('requestAuthorization', () => {
    it('succeeds and sets status to Authorized', async () => {
      const result = await healthService.requestAuthorization([
        HealthDataType.Workout,
        HealthDataType.Steps,
      ]);

      expect(result.success).toBe(true);
      const status = await healthService.getAuthorizationStatus();
      expect(status).toBe(HealthAuthStatus.Authorized);
    });

    it('fails when platform is None', async () => {
      healthService.setAvailablePlatform(HealthPlatform.None);
      const result = await healthService.requestAuthorization([HealthDataType.Workout]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('No health platform available');
      }
    });

    it('fails when set to fail', async () => {
      healthService.setShouldFail(true, 'Authorization failed');
      const result = await healthService.requestAuthorization([HealthDataType.Workout]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Authorization failed');
      }
    });
  });

  describe('saveWorkout', () => {
    const workout = createHealthWorkoutData({
      startTime: new Date('2024-01-15T10:00:00'),
      endTime: new Date('2024-01-15T11:00:00'),
      workoutType: HealthWorkoutType.Treadmill,
      energyBurned: 350,
      distanceKm: 5.5,
      steps: 8000,
    });

    it('saves workout when authorized', async () => {
      healthService.setAuthorizationStatus(HealthAuthStatus.Authorized);
      const result = await healthService.saveWorkout(workout);

      expect(result.success).toBe(true);
      expect(healthService.getStoredWorkouts()).toHaveLength(1);
      expect(healthService.getStoredWorkouts()[0]).toEqual(workout);
    });

    it('fails when not authorized', async () => {
      const result = await healthService.saveWorkout(workout);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Not authorized to save workouts');
      }
    });

    it('fails when set to fail', async () => {
      healthService.setAuthorizationStatus(HealthAuthStatus.Authorized);
      healthService.setShouldFail(true);
      const result = await healthService.saveWorkout(workout);

      expect(result.success).toBe(false);
    });
  });

  describe('deleteWorkout', () => {
    const startTime = new Date('2024-01-15T10:00:00');
    const workout = createHealthWorkoutData({
      startTime,
      endTime: new Date('2024-01-15T11:00:00'),
      workoutType: HealthWorkoutType.Treadmill,
      energyBurned: 350,
      distanceKm: 5.5,
      steps: 8000,
    });

    it('deletes workout when authorized', async () => {
      healthService.setAuthorizationStatus(HealthAuthStatus.Authorized);
      healthService.addWorkout(workout);

      const result = await healthService.deleteWorkout(startTime);

      expect(result.success).toBe(true);
      expect(healthService.getStoredWorkouts()).toHaveLength(0);
    });

    it('fails when not authorized', async () => {
      healthService.addWorkout(workout);
      const result = await healthService.deleteWorkout(startTime);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Not authorized to delete workouts');
      }
    });

    it('fails when workout not found', async () => {
      healthService.setAuthorizationStatus(HealthAuthStatus.Authorized);
      const result = await healthService.deleteWorkout(new Date());

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Workout not found');
      }
    });
  });

  describe('getWorkouts', () => {
    const workout1 = createHealthWorkoutData({
      startTime: new Date('2024-01-15T10:00:00'),
      endTime: new Date('2024-01-15T11:00:00'),
      workoutType: HealthWorkoutType.Treadmill,
      energyBurned: 350,
      distanceKm: 5.5,
      steps: 8000,
    });

    const workout2 = createHealthWorkoutData({
      startTime: new Date('2024-01-16T10:00:00'),
      endTime: new Date('2024-01-16T11:00:00'),
      workoutType: HealthWorkoutType.Walking,
      energyBurned: 200,
      distanceKm: 3.0,
      steps: 5000,
    });

    it('returns workouts in date range when authorized', async () => {
      healthService.setAuthorizationStatus(HealthAuthStatus.Authorized);
      healthService.addWorkout(workout1);
      healthService.addWorkout(workout2);

      const result = await healthService.getWorkouts(
        new Date('2024-01-15T00:00:00'),
        new Date('2024-01-15T23:59:59'),
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(1);
        expect(result.data[0]).toEqual(workout1);
      }
    });

    it('returns all workouts when range includes all', async () => {
      healthService.setAuthorizationStatus(HealthAuthStatus.Authorized);
      healthService.addWorkout(workout1);
      healthService.addWorkout(workout2);

      const result = await healthService.getWorkouts(
        new Date('2024-01-01T00:00:00'),
        new Date('2024-01-31T23:59:59'),
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(2);
      }
    });

    it('fails when not authorized', async () => {
      healthService.addWorkout(workout1);
      const result = await healthService.getWorkouts(
        new Date('2024-01-01'),
        new Date('2024-01-31'),
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Not authorized to read workouts');
      }
    });
  });

  describe('test helpers', () => {
    it('clears workouts', () => {
      const workout = createHealthWorkoutData({
        startTime: new Date(),
        endTime: new Date(),
        workoutType: HealthWorkoutType.Running,
        energyBurned: 100,
        distanceKm: 1.0,
        steps: 1000,
      });

      healthService.addWorkout(workout);
      expect(healthService.getStoredWorkouts()).toHaveLength(1);

      healthService.clearWorkouts();
      expect(healthService.getStoredWorkouts()).toHaveLength(0);
    });
  });
});
