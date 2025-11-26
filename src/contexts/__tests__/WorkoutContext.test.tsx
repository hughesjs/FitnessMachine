import React from 'react';
import {renderHook, act} from '@testing-library/react-native';
import {WorkoutProvider, useWorkout} from '../WorkoutContext';
import {MockWorkoutRepository} from '../../services/database';
import {WorkoutState, TreadmillData} from '../../models';

describe('WorkoutContext', () => {
  let repository: MockWorkoutRepository;

  beforeEach(async () => {
    repository = new MockWorkoutRepository();
    await repository.initialize();
  });

  afterEach(async () => {
    await repository.close();
  });

  const wrapper = ({children}: {children: React.ReactNode}) => (
    <WorkoutProvider workoutRepository={repository}>{children}</WorkoutProvider>
  );

  describe('initial state', () => {
    it('starts in Idle state', () => {
      const {result} = renderHook(() => useWorkout(), {wrapper});

      expect(result.current.workoutState).toBe(WorkoutState.Idle);
    });

    it('can start workout initially', () => {
      const {result} = renderHook(() => useWorkout(), {wrapper});

      expect(result.current.canStart).toBe(true);
    });

    it('cannot pause or stop initially', () => {
      const {result} = renderHook(() => useWorkout(), {wrapper});

      expect(result.current.canPause).toBe(false);
      expect(result.current.canStop).toBe(false);
    });
  });

  describe('startWorkout', () => {
    it('transitions to Running state', async () => {
      const {result} = renderHook(() => useWorkout(), {wrapper});

      await act(async () => {
        result.current.startWorkout();
      });

      expect(result.current.workoutState).toBe(WorkoutState.Running);
    });

    it('sets workout start time', async () => {
      const {result} = renderHook(() => useWorkout(), {wrapper});

      const before = new Date();
      await act(async () => {
        result.current.startWorkout();
      });
      const after = new Date();

      const startTime = result.current.workoutStartTime;
      expect(startTime).toBeDefined();
      expect(startTime?.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(startTime?.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('allows pause after starting', async () => {
      const {result} = renderHook(() => useWorkout(), {wrapper});

      await act(async () => {
        result.current.startWorkout();
      });

      expect(result.current.canPause).toBe(true);
      expect(result.current.canStart).toBe(false);
    });
  });

  describe('pauseWorkout', () => {
    it('transitions from Running to Paused', async () => {
      const {result} = renderHook(() => useWorkout(), {wrapper});

      await act(async () => {
        result.current.startWorkout();
      });

      await act(async () => {
        result.current.pauseWorkout();
      });

      expect(result.current.workoutState).toBe(WorkoutState.Paused);
    });

    it('allows resume after pausing', async () => {
      const {result} = renderHook(() => useWorkout(), {wrapper});

      await act(async () => {
        result.current.startWorkout();
      });

      await act(async () => {
        result.current.pauseWorkout();
      });

      expect(result.current.canResume).toBe(true);
      expect(result.current.canPause).toBe(false);
    });
  });

  describe('resumeWorkout', () => {
    it('transitions from Paused to Running', async () => {
      const {result} = renderHook(() => useWorkout(), {wrapper});

      await act(async () => {
        result.current.startWorkout();
      });

      await act(async () => {
        result.current.pauseWorkout();
      });

      await act(async () => {
        result.current.resumeWorkout();
      });

      expect(result.current.workoutState).toBe(WorkoutState.Running);
    });
  });

  describe('stopWorkout', () => {
    it('saves workout and returns to Idle', async () => {
      const {result} = renderHook(() => useWorkout(), {wrapper});

      await act(async () => {
        result.current.startWorkout();
      });

      const treadmillData: TreadmillData = {
        speedInKmh: 0,
        distanceInKm: 2.5,
        timeInSeconds: 1800,
        indicatedKiloCalories: 200,
        steps: 3000,
      };

      let completedWorkout: unknown = null;
      await act(async () => {
        completedWorkout = await result.current.stopWorkout(treadmillData);
      });

      expect(result.current.workoutState).toBe(WorkoutState.Idle);
      expect(completedWorkout).toBeDefined();
    });

    it('saves to repository', async () => {
      const {result} = renderHook(() => useWorkout(), {wrapper});

      await act(async () => {
        result.current.startWorkout();
      });

      const treadmillData: TreadmillData = {
        speedInKmh: 0,
        distanceInKm: 2.5,
        timeInSeconds: 1800,
        indicatedKiloCalories: 200,
        steps: 3000,
      };

      await act(async () => {
        await result.current.stopWorkout(treadmillData);
      });

      const dbResult = await repository.getWorkoutCount();
      expect(dbResult.success).toBe(true);
      if (dbResult.success) {
        expect(dbResult.data).toBe(1);
      }
    });

    it('calls onWorkoutCompleted callback', async () => {
      const onCompleted = jest.fn();

      const wrapperWithCallback = ({children}: {children: React.ReactNode}) => (
        <WorkoutProvider
          workoutRepository={repository}
          onWorkoutCompleted={onCompleted}>
          {children}
        </WorkoutProvider>
      );

      const {result} = renderHook(() => useWorkout(), {wrapper: wrapperWithCallback});

      await act(async () => {
        result.current.startWorkout();
      });

      const treadmillData: TreadmillData = {
        speedInKmh: 0,
        distanceInKm: 2.5,
        timeInSeconds: 1800,
        indicatedKiloCalories: 200,
        steps: 3000,
      };

      await act(async () => {
        await result.current.stopWorkout(treadmillData);
      });

      expect(onCompleted).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetWorkout', () => {
    it('returns to Idle without saving', async () => {
      const {result} = renderHook(() => useWorkout(), {wrapper});

      await act(async () => {
        result.current.startWorkout();
      });

      await act(async () => {
        result.current.resetWorkout();
      });

      expect(result.current.workoutState).toBe(WorkoutState.Idle);

      const dbResult = await repository.getWorkoutCount();
      expect(dbResult.success).toBe(true);
      if (dbResult.success) {
        expect(dbResult.data).toBe(0);
      }
    });
  });
});
