import React from 'react';
import {render, act, waitFor} from '@testing-library/react-native';
import {Text} from 'react-native';
import {WorkoutHistoryProvider, useWorkoutHistory} from '../WorkoutHistoryContext';
import {MockWorkoutRepository} from '../../services/database';
import {CompletedWorkout} from '../../models';

// Type for the context value
type WorkoutHistoryContextValue = ReturnType<typeof useWorkoutHistory>;

// Use a ref-based approach to capture the latest context
function TestConsumer({
  contextRef,
}: {
  contextRef: React.MutableRefObject<WorkoutHistoryContextValue | null>;
}): React.JSX.Element {
  const context = useWorkoutHistory();
  contextRef.current = context;
  return <Text>Workouts: {context.workouts.length}</Text>;
}

describe('WorkoutHistoryContext', () => {
  let repository: MockWorkoutRepository;
  let contextRef: React.MutableRefObject<WorkoutHistoryContextValue | null>;

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
    contextRef = {current: null};
  });

  afterEach(async () => {
    await repository.close();
  });

  const renderWithProvider = () => {
    return render(
      <WorkoutHistoryProvider workoutRepository={repository}>
        <TestConsumer contextRef={contextRef} />
      </WorkoutHistoryProvider>,
    );
  };

  describe('initial load', () => {
    it('loads workouts on mount', async () => {
      repository.addWorkouts([
        createTestWorkout('workout-1'),
        createTestWorkout('workout-2'),
      ]);

      renderWithProvider();

      await waitFor(() => {
        expect(contextRef.current?.workouts).toHaveLength(2);
      });
    });

    it('sets isLoading to false after load', async () => {
      renderWithProvider();

      await waitFor(() => {
        expect(contextRef.current?.isLoading).toBe(false);
      });
    });
  });

  describe('addWorkout', () => {
    it('adds workout to the list', async () => {
      renderWithProvider();

      await waitFor(() => {
        expect(contextRef.current?.isLoading).toBe(false);
      });

      const newWorkout = createTestWorkout('new-workout');

      await act(async () => {
        contextRef.current?.addWorkout(newWorkout);
      });

      expect(contextRef.current?.workouts).toHaveLength(1);
      expect(contextRef.current?.workouts[0]?.workoutId).toBe('new-workout');
    });

    it('maintains sorted order (newest first)', async () => {
      repository.addWorkouts([
        createTestWorkout('older', new Date('2024-01-01')),
      ]);

      renderWithProvider();

      await waitFor(() => {
        expect(contextRef.current?.isLoading).toBe(false);
      });

      const newerWorkout = createTestWorkout('newer', new Date('2024-01-02'));

      await act(async () => {
        contextRef.current?.addWorkout(newerWorkout);
      });

      expect(contextRef.current?.workouts[0]?.workoutId).toBe('newer');
      expect(contextRef.current?.workouts[1]?.workoutId).toBe('older');
    });
  });

  describe('deleteWorkout', () => {
    it('removes workout from list', async () => {
      repository.addWorkouts([
        createTestWorkout('workout-1'),
        createTestWorkout('workout-2'),
      ]);

      renderWithProvider();

      await waitFor(() => {
        expect(contextRef.current?.workouts).toHaveLength(2);
      });

      let success = false;
      await act(async () => {
        success = (await contextRef.current?.deleteWorkout('workout-1')) ?? false;
      });

      expect(success).toBe(true);
      expect(contextRef.current?.workouts).toHaveLength(1);
      expect(contextRef.current?.workouts[0]?.workoutId).toBe('workout-2');
    });
  });

  describe('deleteAllWorkouts', () => {
    it('clears all workouts', async () => {
      repository.addWorkouts([
        createTestWorkout('workout-1'),
        createTestWorkout('workout-2'),
        createTestWorkout('workout-3'),
      ]);

      renderWithProvider();

      await waitFor(() => {
        expect(contextRef.current?.workouts).toHaveLength(3);
      });

      let success = false;
      await act(async () => {
        success = (await contextRef.current?.deleteAllWorkouts()) ?? false;
      });

      expect(success).toBe(true);
      expect(contextRef.current?.workouts).toHaveLength(0);
    });
  });

  describe('refresh', () => {
    it('reloads workouts from repository', async () => {
      renderWithProvider();

      await waitFor(() => {
        expect(contextRef.current?.isLoading).toBe(false);
      });

      expect(contextRef.current?.workouts).toHaveLength(0);

      // Add directly to repository
      repository.addWorkouts([createTestWorkout('new-workout')]);

      await act(async () => {
        await contextRef.current?.refresh();
      });

      expect(contextRef.current?.workouts).toHaveLength(1);
    });
  });
});
