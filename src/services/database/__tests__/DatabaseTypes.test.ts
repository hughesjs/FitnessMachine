import {
  workoutToRow,
  rowToWorkout,
  dbSuccess,
  dbError,
  WorkoutRow,
} from '../DatabaseTypes';
import {CompletedWorkout} from '../../../models';

describe('DatabaseTypes', () => {
  describe('workoutToRow', () => {
    it('converts a CompletedWorkout to a WorkoutRow', () => {
      const workout: CompletedWorkout = {
        workoutId: 'workout-123',
        distanceInKm: 2.5,
        totalSteps: 3000,
        workoutTimeInSeconds: 1800,
        machineIndicatedCalories: 200,
        calculatedCalories: 180,
        startedAt: new Date('2024-01-15T10:00:00Z'),
        completedAt: new Date('2024-01-15T10:30:00Z'),
      };

      const row = workoutToRow(workout);

      expect(row.workout_id).toBe('workout-123');
      expect(row.distance_in_km).toBe(2.5);
      expect(row.total_steps).toBe(3000);
      expect(row.workout_time_in_seconds).toBe(1800);
      expect(row.machine_indicated_calories).toBe(200);
      expect(row.calculated_calories).toBe(180);
      expect(row.started_at).toBe('2024-01-15T10:00:00.000Z');
      expect(row.completed_at).toBe('2024-01-15T10:30:00.000Z');
    });
  });

  describe('rowToWorkout', () => {
    it('converts a WorkoutRow to a CompletedWorkout', () => {
      const row: WorkoutRow = {
        workout_id: 'workout-456',
        distance_in_km: 3.5,
        total_steps: 4000,
        workout_time_in_seconds: 2400,
        machine_indicated_calories: 300,
        calculated_calories: 280,
        started_at: '2024-01-15T11:00:00.000Z',
        completed_at: '2024-01-15T11:40:00.000Z',
      };

      const workout = rowToWorkout(row);

      expect(workout.workoutId).toBe('workout-456');
      expect(workout.distanceInKm).toBe(3.5);
      expect(workout.totalSteps).toBe(4000);
      expect(workout.workoutTimeInSeconds).toBe(2400);
      expect(workout.machineIndicatedCalories).toBe(300);
      expect(workout.calculatedCalories).toBe(280);
      expect(workout.startedAt.toISOString()).toBe('2024-01-15T11:00:00.000Z');
      expect(workout.completedAt.toISOString()).toBe('2024-01-15T11:40:00.000Z');
    });

    it('roundtrips correctly', () => {
      const original: CompletedWorkout = {
        workoutId: 'workout-789',
        distanceInKm: 5.0,
        totalSteps: 6000,
        workoutTimeInSeconds: 3600,
        machineIndicatedCalories: 500,
        calculatedCalories: 480,
        startedAt: new Date('2024-01-15T12:00:00Z'),
        completedAt: new Date('2024-01-15T13:00:00Z'),
      };

      const row = workoutToRow(original);
      const recovered = rowToWorkout(row);

      expect(recovered.workoutId).toBe(original.workoutId);
      expect(recovered.distanceInKm).toBe(original.distanceInKm);
      expect(recovered.totalSteps).toBe(original.totalSteps);
      expect(recovered.workoutTimeInSeconds).toBe(original.workoutTimeInSeconds);
      expect(recovered.machineIndicatedCalories).toBe(original.machineIndicatedCalories);
      expect(recovered.calculatedCalories).toBe(original.calculatedCalories);
      expect(recovered.startedAt.getTime()).toBe(original.startedAt.getTime());
      expect(recovered.completedAt.getTime()).toBe(original.completedAt.getTime());
    });
  });

  describe('dbSuccess', () => {
    it('creates a success result with data', () => {
      const result = dbSuccess('test data');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('test data');
      }
    });

    it('works with complex data', () => {
      const data = {foo: 'bar', count: 42};
      const result = dbSuccess(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(data);
      }
    });
  });

  describe('dbError', () => {
    it('creates an error result with message', () => {
      const result = dbError<string>('Something went wrong');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Something went wrong');
      }
    });
  });
});
