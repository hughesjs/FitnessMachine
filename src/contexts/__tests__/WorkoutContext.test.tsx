import React, {useRef, useEffect} from 'react';
import {render, act} from '@testing-library/react-native';
import {Text} from 'react-native';
import {WorkoutProvider, useWorkout} from '../WorkoutContext';
import {MockWorkoutRepository} from '../../services/database';
import {WorkoutState, TreadmillData} from '../../models';

// Type for the context value
type WorkoutContextValue = ReturnType<typeof useWorkout>;

// Use a ref-based approach to capture the latest context
function TestConsumer({
  contextRef,
}: {
  contextRef: React.MutableRefObject<WorkoutContextValue | null>;
}): React.JSX.Element {
  const context = useWorkout();
  contextRef.current = context;
  return <Text>{context.workoutState}</Text>;
}

describe('WorkoutContext', () => {
  let repository: MockWorkoutRepository;
  let contextRef: React.MutableRefObject<WorkoutContextValue | null>;

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
      <WorkoutProvider workoutRepository={repository}>
        <TestConsumer contextRef={contextRef} />
      </WorkoutProvider>,
    );
  };

  describe('initial state', () => {
    it('starts in Idle state', () => {
      renderWithProvider();

      expect(contextRef.current?.workoutState).toBe(WorkoutState.Idle);
    });

    it('can start workout initially', () => {
      renderWithProvider();

      expect(contextRef.current?.canStart).toBe(true);
    });

    it('cannot pause or stop initially', () => {
      renderWithProvider();

      expect(contextRef.current?.canPause).toBe(false);
      expect(contextRef.current?.canStop).toBe(false);
    });
  });

  describe('startWorkout', () => {
    it('transitions to Running state', async () => {
      renderWithProvider();

      await act(async () => {
        contextRef.current?.startWorkout();
      });

      expect(contextRef.current?.workoutState).toBe(WorkoutState.Running);
    });

    it('sets workout start time', async () => {
      renderWithProvider();

      const before = new Date();
      await act(async () => {
        contextRef.current?.startWorkout();
      });
      const after = new Date();

      const startTime = contextRef.current?.workoutStartTime;
      expect(startTime).toBeDefined();
      expect(startTime?.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(startTime?.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('allows pause after starting', async () => {
      renderWithProvider();

      await act(async () => {
        contextRef.current?.startWorkout();
      });

      expect(contextRef.current?.canPause).toBe(true);
      expect(contextRef.current?.canStart).toBe(false);
    });
  });

  describe('pauseWorkout', () => {
    it('transitions from Running to Paused', async () => {
      renderWithProvider();

      await act(async () => {
        contextRef.current?.startWorkout();
      });

      await act(async () => {
        contextRef.current?.pauseWorkout();
      });

      expect(contextRef.current?.workoutState).toBe(WorkoutState.Paused);
    });

    it('allows resume after pausing', async () => {
      renderWithProvider();

      await act(async () => {
        contextRef.current?.startWorkout();
      });

      await act(async () => {
        contextRef.current?.pauseWorkout();
      });

      expect(contextRef.current?.canResume).toBe(true);
      expect(contextRef.current?.canPause).toBe(false);
    });
  });

  describe('resumeWorkout', () => {
    it('transitions from Paused to Running', async () => {
      renderWithProvider();

      await act(async () => {
        contextRef.current?.startWorkout();
      });

      await act(async () => {
        contextRef.current?.pauseWorkout();
      });

      await act(async () => {
        contextRef.current?.resumeWorkout();
      });

      expect(contextRef.current?.workoutState).toBe(WorkoutState.Running);
    });
  });

  describe('stopWorkout', () => {
    it('saves workout and returns to Idle', async () => {
      renderWithProvider();

      await act(async () => {
        contextRef.current?.startWorkout();
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
        completedWorkout = await contextRef.current?.stopWorkout(treadmillData);
      });

      expect(contextRef.current?.workoutState).toBe(WorkoutState.Idle);
      expect(completedWorkout).toBeDefined();
    });

    it('saves to repository', async () => {
      renderWithProvider();

      await act(async () => {
        contextRef.current?.startWorkout();
      });

      const treadmillData: TreadmillData = {
        speedInKmh: 0,
        distanceInKm: 2.5,
        timeInSeconds: 1800,
        indicatedKiloCalories: 200,
        steps: 3000,
      };

      await act(async () => {
        await contextRef.current?.stopWorkout(treadmillData);
      });

      const result = await repository.getWorkoutCount();
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(1);
      }
    });

    it('calls onWorkoutCompleted callback', async () => {
      const onCompleted = jest.fn();
      const localRef: React.MutableRefObject<WorkoutContextValue | null> = {
        current: null,
      };

      render(
        <WorkoutProvider
          workoutRepository={repository}
          onWorkoutCompleted={onCompleted}>
          <TestConsumer contextRef={localRef} />
        </WorkoutProvider>,
      );

      await act(async () => {
        localRef.current?.startWorkout();
      });

      const treadmillData: TreadmillData = {
        speedInKmh: 0,
        distanceInKm: 2.5,
        timeInSeconds: 1800,
        indicatedKiloCalories: 200,
        steps: 3000,
      };

      await act(async () => {
        await localRef.current?.stopWorkout(treadmillData);
      });

      expect(onCompleted).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetWorkout', () => {
    it('returns to Idle without saving', async () => {
      renderWithProvider();

      await act(async () => {
        contextRef.current?.startWorkout();
      });

      await act(async () => {
        contextRef.current?.resetWorkout();
      });

      expect(contextRef.current?.workoutState).toBe(WorkoutState.Idle);

      const result = await repository.getWorkoutCount();
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(0);
      }
    });
  });
});
