import {MockWorkoutRepository} from '../MockWorkoutRepository';
import {CompletedWorkout} from '../../../models';

describe('MockWorkoutRepository', () => {
  let repository: MockWorkoutRepository;

  const createTestWorkout = (
    id: string,
    completedAt: Date = new Date(),
  ): CompletedWorkout => ({
    workoutId: id,
    distanceInKm: 2.5,
    totalSteps: 3000,
    workoutTimeInSeconds: 1800,
    machineIndicatedCalories: 200,
    calculatedCalories: 180,
    startedAt: new Date(completedAt.getTime() - 30 * 60 * 1000),
    completedAt,
  });

  beforeEach(async () => {
    repository = new MockWorkoutRepository();
    await repository.initialize();
  });

  afterEach(async () => {
    await repository.close();
  });

  describe('initialization', () => {
    it('initializes successfully', async () => {
      const newRepo = new MockWorkoutRepository();
      await expect(newRepo.initialize()).resolves.toBeUndefined();
    });

    it('fails operations before initialization', async () => {
      const uninitializedRepo = new MockWorkoutRepository();

      const result = await uninitializedRepo.getAllWorkouts();

      expect(result.success).toBe(false);
    });
  });

  describe('saveWorkout', () => {
    it('saves a workout successfully', async () => {
      const workout = createTestWorkout('workout-1');

      const result = await repository.saveWorkout(workout);

      expect(result.success).toBe(true);
    });

    it('allows retrieving saved workout', async () => {
      const workout = createTestWorkout('workout-1');
      await repository.saveWorkout(workout);

      const result = await repository.getWorkoutById('workout-1');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data?.workoutId).toBe('workout-1');
      }
    });

    it('overwrites existing workout with same ID', async () => {
      const workout1 = createTestWorkout('workout-1');
      const workout2 = {...createTestWorkout('workout-1'), distanceInKm: 5.0};

      await repository.saveWorkout(workout1);
      await repository.saveWorkout(workout2);

      const result = await repository.getWorkoutById('workout-1');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data?.distanceInKm).toBe(5.0);
      }
    });
  });

  describe('getAllWorkouts', () => {
    it('returns empty array when no workouts', async () => {
      const result = await repository.getAllWorkouts();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([]);
      }
    });

    it('returns all workouts', async () => {
      await repository.saveWorkout(createTestWorkout('workout-1'));
      await repository.saveWorkout(createTestWorkout('workout-2'));
      await repository.saveWorkout(createTestWorkout('workout-3'));

      const result = await repository.getAllWorkouts();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(3);
      }
    });

    it('returns workouts sorted by completion date (newest first)', async () => {
      const older = createTestWorkout('older', new Date('2024-01-01T10:00:00Z'));
      const newer = createTestWorkout('newer', new Date('2024-01-02T10:00:00Z'));
      const newest = createTestWorkout('newest', new Date('2024-01-03T10:00:00Z'));

      await repository.saveWorkout(older);
      await repository.saveWorkout(newest);
      await repository.saveWorkout(newer);

      const result = await repository.getAllWorkouts();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data[0]?.workoutId).toBe('newest');
        expect(result.data[1]?.workoutId).toBe('newer');
        expect(result.data[2]?.workoutId).toBe('older');
      }
    });
  });

  describe('getWorkoutById', () => {
    it('returns null for non-existent workout', async () => {
      const result = await repository.getWorkoutById('non-existent');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
    });

    it('returns workout for existing ID', async () => {
      const workout = createTestWorkout('workout-1');
      await repository.saveWorkout(workout);

      const result = await repository.getWorkoutById('workout-1');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data?.workoutId).toBe('workout-1');
        expect(result.data?.distanceInKm).toBe(2.5);
      }
    });
  });

  describe('deleteWorkout', () => {
    it('deletes existing workout', async () => {
      await repository.saveWorkout(createTestWorkout('workout-1'));

      const result = await repository.deleteWorkout('workout-1');

      expect(result.success).toBe(true);

      const getResult = await repository.getWorkoutById('workout-1');
      if (getResult.success) {
        expect(getResult.data).toBeNull();
      }
    });

    it('succeeds even for non-existent workout', async () => {
      const result = await repository.deleteWorkout('non-existent');

      expect(result.success).toBe(true);
    });
  });

  describe('deleteAllWorkouts', () => {
    it('deletes all workouts', async () => {
      await repository.saveWorkout(createTestWorkout('workout-1'));
      await repository.saveWorkout(createTestWorkout('workout-2'));
      await repository.saveWorkout(createTestWorkout('workout-3'));

      const result = await repository.deleteAllWorkouts();

      expect(result.success).toBe(true);

      const countResult = await repository.getWorkoutCount();
      if (countResult.success) {
        expect(countResult.data).toBe(0);
      }
    });
  });

  describe('getWorkoutCount', () => {
    it('returns 0 for empty repository', async () => {
      const result = await repository.getWorkoutCount();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(0);
      }
    });

    it('returns correct count', async () => {
      await repository.saveWorkout(createTestWorkout('workout-1'));
      await repository.saveWorkout(createTestWorkout('workout-2'));

      const result = await repository.getWorkoutCount();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(2);
      }
    });
  });

  describe('test helpers', () => {
    it('addWorkouts adds workouts directly', async () => {
      repository.addWorkouts([
        createTestWorkout('workout-1'),
        createTestWorkout('workout-2'),
      ]);

      const result = await repository.getWorkoutCount();
      if (result.success) {
        expect(result.data).toBe(2);
      }
    });

    it('clear removes all workouts', async () => {
      repository.addWorkouts([
        createTestWorkout('workout-1'),
        createTestWorkout('workout-2'),
      ]);

      repository.clear();

      const result = await repository.getWorkoutCount();
      if (result.success) {
        expect(result.data).toBe(0);
      }
    });
  });
});
