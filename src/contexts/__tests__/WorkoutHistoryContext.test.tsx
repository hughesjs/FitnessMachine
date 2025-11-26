import React from 'react';
import {renderHook, act, waitFor} from '@testing-library/react-native';
import {WorkoutHistoryProvider, useWorkoutHistory} from '../WorkoutHistoryContext';
import {MockWorkoutRepository} from '../../services/database';
import {CompletedWorkout} from '../../models';

describe('WorkoutHistoryContext', () => {
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

  const wrapper = ({children}: {children: React.ReactNode}) => (
    <WorkoutHistoryProvider workoutRepository={repository}>
      {children}
    </WorkoutHistoryProvider>
  );

  describe('initial load', () => {
    it('loads workouts on mount', async () => {
      repository.addWorkouts([
        createTestWorkout('workout-1'),
        createTestWorkout('workout-2'),
      ]);

      const {result} = renderHook(() => useWorkoutHistory(), {wrapper});

      await waitFor(() => {
        expect(result.current.workouts).toHaveLength(2);
      });
    });

    it('sets isLoading to false after load', async () => {
      const {result} = renderHook(() => useWorkoutHistory(), {wrapper});

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('addWorkout', () => {
    it('adds workout to the list', async () => {
      const {result} = renderHook(() => useWorkoutHistory(), {wrapper});

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const newWorkout = createTestWorkout('new-workout');

      await act(async () => {
        result.current.addWorkout(newWorkout);
      });

      expect(result.current.workouts).toHaveLength(1);
      expect(result.current.workouts[0]?.workoutId).toBe('new-workout');
    });

    it('maintains sorted order (newest first)', async () => {
      repository.addWorkouts([
        createTestWorkout('older', new Date('2024-01-01')),
      ]);

      const {result} = renderHook(() => useWorkoutHistory(), {wrapper});

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const newerWorkout = createTestWorkout('newer', new Date('2024-01-02'));

      await act(async () => {
        result.current.addWorkout(newerWorkout);
      });

      expect(result.current.workouts[0]?.workoutId).toBe('newer');
      expect(result.current.workouts[1]?.workoutId).toBe('older');
    });
  });

  describe('deleteWorkout', () => {
    it('removes workout from list', async () => {
      repository.addWorkouts([
        createTestWorkout('workout-1'),
        createTestWorkout('workout-2'),
      ]);

      const {result} = renderHook(() => useWorkoutHistory(), {wrapper});

      await waitFor(() => {
        expect(result.current.workouts).toHaveLength(2);
      });

      let success = false;
      await act(async () => {
        success = (await result.current.deleteWorkout('workout-1')) ?? false;
      });

      expect(success).toBe(true);
      expect(result.current.workouts).toHaveLength(1);
      expect(result.current.workouts[0]?.workoutId).toBe('workout-2');
    });
  });

  describe('deleteAllWorkouts', () => {
    it('clears all workouts', async () => {
      repository.addWorkouts([
        createTestWorkout('workout-1'),
        createTestWorkout('workout-2'),
        createTestWorkout('workout-3'),
      ]);

      const {result} = renderHook(() => useWorkoutHistory(), {wrapper});

      await waitFor(() => {
        expect(result.current.workouts).toHaveLength(3);
      });

      let success = false;
      await act(async () => {
        success = (await result.current.deleteAllWorkouts()) ?? false;
      });

      expect(success).toBe(true);
      expect(result.current.workouts).toHaveLength(0);
    });
  });

  describe('refresh', () => {
    it('reloads workouts from repository', async () => {
      const {result} = renderHook(() => useWorkoutHistory(), {wrapper});

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.workouts).toHaveLength(0);

      // Add directly to repository
      repository.addWorkouts([createTestWorkout('new-workout')]);

      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.workouts).toHaveLength(1);
    });
  });
});
