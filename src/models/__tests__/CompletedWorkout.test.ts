import {
  createCompletedWorkout,
  calculateCalories,
  generateWorkoutId,
  formatWorkoutDuration,
  formatWorkoutDate,
  formatWorkoutTime,
} from '../CompletedWorkout';

describe('CompletedWorkout', () => {
  describe('createCompletedWorkout', () => {
    it('creates workout with all fields', () => {
      const startedAt = new Date('2024-01-15T10:00:00');
      const completedAt = new Date('2024-01-15T10:30:00');

      const workout = createCompletedWorkout({
        workoutId: 'test-123',
        distanceInKm: 2.5,
        totalSteps: 3000,
        workoutTimeInSeconds: 1800,
        machineIndicatedCalories: 200,
        calculatedCalories: 180,
        startedAt,
        completedAt,
      });

      expect(workout.workoutId).toBe('test-123');
      expect(workout.distanceInKm).toBe(2.5);
      expect(workout.totalSteps).toBe(3000);
      expect(workout.workoutTimeInSeconds).toBe(1800);
      expect(workout.machineIndicatedCalories).toBe(200);
      expect(workout.calculatedCalories).toBe(180);
      expect(workout.startedAt).toEqual(startedAt);
      expect(workout.completedAt).toEqual(completedAt);
    });
  });

  describe('calculateCalories', () => {
    it('returns 0 for zero duration', () => {
      expect(calculateCalories(5.0, 0, 80)).toBe(0);
    });

    it('calculates calories for slow walking pace', () => {
      // 3 km in 1 hour = 3 km/h, MET ~3.0
      // 3.0 * 80 kg * 1 hour = 240 calories
      const calories = calculateCalories(3.0, 3600, 80);
      expect(calories).toBe(240);
    });

    it('calculates calories for brisk walking', () => {
      // 5 km in 1 hour = 5 km/h, MET ~3.8
      // 3.8 * 80 * 1 = 304 calories
      const calories = calculateCalories(5.0, 3600, 80);
      expect(calories).toBe(304);
    });

    it('calculates calories for jogging', () => {
      // 8 km in 1 hour = 8 km/h, MET ~8.3
      // 8.3 * 80 * 1 = 664 calories
      const calories = calculateCalories(8.0, 3600, 80);
      expect(calories).toBe(664);
    });

    it('calculates calories for running', () => {
      // 12 km in 1 hour = 12 km/h, MET ~11.5
      // 11.5 * 80 * 1 = 920 calories
      const calories = calculateCalories(12.0, 3600, 80);
      expect(calories).toBe(920);
    });

    it('scales with weight', () => {
      // Same workout, different weight
      const calories60 = calculateCalories(5.0, 3600, 60);
      const calories100 = calculateCalories(5.0, 3600, 100);

      expect(calories100).toBeGreaterThan(calories60);
      // 3.8 * 60 = 228, 3.8 * 100 = 380
      expect(calories60).toBe(228);
      expect(calories100).toBe(380);
    });

    it('scales with duration', () => {
      // 30 minutes at 5 km/h
      const calories30min = calculateCalories(2.5, 1800, 80);
      // 3.8 * 80 * 0.5 = 152
      expect(calories30min).toBe(152);
    });
  });

  describe('generateWorkoutId', () => {
    it('generates unique IDs', () => {
      const id1 = generateWorkoutId();
      const id2 = generateWorkoutId();

      expect(id1).not.toBe(id2);
    });

    it('generates IDs with workout prefix', () => {
      const id = generateWorkoutId();

      expect(id).toMatch(/^workout-/);
    });

    it('generates IDs with timestamp', () => {
      const before = Date.now();
      const id = generateWorkoutId();
      const after = Date.now();

      const parts = id.split('-');
      const timestamp = parseInt(parts[1] ?? '0', 10);

      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('formatWorkoutDuration', () => {
    it('formats seconds only', () => {
      expect(formatWorkoutDuration(45)).toBe('45s');
    });

    it('formats minutes and seconds', () => {
      expect(formatWorkoutDuration(125)).toBe('2m 5s');
    });

    it('formats hours and minutes', () => {
      expect(formatWorkoutDuration(3725)).toBe('1h 2m');
    });

    it('handles zero', () => {
      expect(formatWorkoutDuration(0)).toBe('0s');
    });

    it('handles exactly one minute', () => {
      expect(formatWorkoutDuration(60)).toBe('1m 0s');
    });

    it('handles exactly one hour', () => {
      expect(formatWorkoutDuration(3600)).toBe('1h 0m');
    });
  });

  describe('formatWorkoutDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15T10:00:00');
      const formatted = formatWorkoutDate(date);

      // The exact format depends on locale, but should contain these parts
      expect(formatted).toContain('2024');
      expect(formatted).toContain('15');
    });
  });

  describe('formatWorkoutTime', () => {
    it('formats time correctly', () => {
      const date = new Date('2024-01-15T10:30:00');
      const formatted = formatWorkoutTime(date);

      // Should contain hour and minute
      expect(formatted).toMatch(/\d{1,2}:\d{2}/);
    });
  });
});
