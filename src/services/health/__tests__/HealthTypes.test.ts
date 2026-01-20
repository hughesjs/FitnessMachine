import {
  HealthPlatform,
  HealthAuthStatus,
  HealthWorkoutType,
  createHealthWorkoutData,
  getHealthPlatformName,
  getAuthStatusMessage,
} from '../HealthTypes';

describe('HealthTypes', () => {
  describe('createHealthWorkoutData', () => {
    it('creates workout data with all fields', () => {
      const startTime = new Date('2024-01-15T10:00:00');
      const endTime = new Date('2024-01-15T11:00:00');

      const workout = createHealthWorkoutData({
        startTime,
        endTime,
        workoutType: HealthWorkoutType.Treadmill,
        energyBurned: 350,
        distanceKm: 5.5,
        steps: 8000,
      });

      expect(workout.startTime).toBe(startTime);
      expect(workout.endTime).toBe(endTime);
      expect(workout.workoutType).toBe(HealthWorkoutType.Treadmill);
      expect(workout.energyBurned).toBe(350);
      expect(workout.distanceKm).toBe(5.5);
      expect(workout.steps).toBe(8000);
    });

    it('creates workout with zero values', () => {
      const workout = createHealthWorkoutData({
        startTime: new Date(),
        endTime: new Date(),
        workoutType: HealthWorkoutType.Walking,
        energyBurned: 0,
        distanceKm: 0,
        steps: 0,
      });

      expect(workout.energyBurned).toBe(0);
      expect(workout.distanceKm).toBe(0);
      expect(workout.steps).toBe(0);
    });
  });

  describe('getHealthPlatformName', () => {
    it('returns "Apple Health" for AppleHealth', () => {
      expect(getHealthPlatformName(HealthPlatform.AppleHealth)).toBe('Apple Health');
    });

    it('returns "Google Fit" for GoogleFit', () => {
      expect(getHealthPlatformName(HealthPlatform.GoogleFit)).toBe('Google Fit');
    });

    it('returns "None" for None', () => {
      expect(getHealthPlatformName(HealthPlatform.None)).toBe('None');
    });
  });

  describe('getAuthStatusMessage', () => {
    it('returns appropriate message for Authorized', () => {
      expect(getAuthStatusMessage(HealthAuthStatus.Authorized)).toBe('Access granted');
    });

    it('returns appropriate message for Denied', () => {
      expect(getAuthStatusMessage(HealthAuthStatus.Denied)).toBe(
        'Access denied - check settings',
      );
    });

    it('returns appropriate message for NotDetermined', () => {
      expect(getAuthStatusMessage(HealthAuthStatus.NotDetermined)).toBe(
        'Permission not requested',
      );
    });

    it('returns appropriate message for Unknown', () => {
      expect(getAuthStatusMessage(HealthAuthStatus.Unknown)).toBe('Unknown status');
    });
  });
});
