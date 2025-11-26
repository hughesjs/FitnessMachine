import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import {
  WorkoutState,
  CompletedWorkout,
  TreadmillData,
  calculateCalories,
  generateWorkoutId,
  createCompletedWorkout,
} from '../models';
import {WorkoutRepository} from '../services/database';

/**
 * State provided by the Workout context.
 */
interface WorkoutContextState {
  /** Current workout state */
  workoutState: WorkoutState;
  /** Whether workout can be started */
  canStart: boolean;
  /** Whether workout can be paused */
  canPause: boolean;
  /** Whether workout can be resumed */
  canResume: boolean;
  /** Whether workout can be stopped */
  canStop: boolean;
  /** Time when current workout started */
  workoutStartTime: Date | null;
}

/**
 * Actions provided by the Workout context.
 */
interface WorkoutContextActions {
  /** Start a new workout */
  startWorkout: () => void;
  /** Pause the current workout */
  pauseWorkout: () => void;
  /** Resume a paused workout */
  resumeWorkout: () => void;
  /** Stop and save the current workout */
  stopWorkout: (finalData: TreadmillData) => Promise<CompletedWorkout | null>;
  /** Reset workout state without saving */
  resetWorkout: () => void;
}

type WorkoutContextValue = WorkoutContextState & WorkoutContextActions;

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

interface WorkoutProviderProps {
  children: ReactNode;
  workoutRepository: WorkoutRepository;
  onWorkoutCompleted?: (workout: CompletedWorkout) => void;
}

/**
 * Provider component for workout state management.
 */
export function WorkoutProvider({
  children,
  workoutRepository,
  onWorkoutCompleted,
}: WorkoutProviderProps): React.JSX.Element {
  const [workoutState, setWorkoutState] = useState<WorkoutState>(WorkoutState.Idle);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);

  // Use ref for workout ID to avoid stale closures
  const workoutIdRef = useRef<string | null>(null);

  const startWorkout = useCallback(() => {
    if (workoutState !== WorkoutState.Idle) {
      return;
    }

    workoutIdRef.current = generateWorkoutId();
    setWorkoutStartTime(new Date());
    setWorkoutState(WorkoutState.Running);
  }, [workoutState]);

  const pauseWorkout = useCallback(() => {
    if (workoutState !== WorkoutState.Running) {
      return;
    }

    setWorkoutState(WorkoutState.Paused);
  }, [workoutState]);

  const resumeWorkout = useCallback(() => {
    if (workoutState !== WorkoutState.Paused) {
      return;
    }

    setWorkoutState(WorkoutState.Running);
  }, [workoutState]);

  const stopWorkout = useCallback(
    async (finalData: TreadmillData): Promise<CompletedWorkout | null> => {
      if (
        workoutState !== WorkoutState.Running &&
        workoutState !== WorkoutState.Paused
      ) {
        return null;
      }

      if (!workoutIdRef.current || !workoutStartTime) {
        return null;
      }

      const completedAt = new Date();
      const calculatedCals = calculateCalories(
        finalData.distanceInKm,
        finalData.timeInSeconds,
      );

      const completedWorkout = createCompletedWorkout({
        workoutId: workoutIdRef.current,
        distanceInKm: finalData.distanceInKm,
        totalSteps: finalData.steps,
        workoutTimeInSeconds: finalData.timeInSeconds,
        machineIndicatedCalories: finalData.indicatedKiloCalories,
        calculatedCalories: calculatedCals,
        startedAt: workoutStartTime,
        completedAt,
      });

      // Save to repository
      const result = await workoutRepository.saveWorkout(completedWorkout);

      if (result.success) {
        onWorkoutCompleted?.(completedWorkout);
      }

      // Reset state
      workoutIdRef.current = null;
      setWorkoutStartTime(null);
      setWorkoutState(WorkoutState.Idle);

      return completedWorkout;
    },
    [workoutState, workoutStartTime, workoutRepository, onWorkoutCompleted],
  );

  const resetWorkout = useCallback(() => {
    workoutIdRef.current = null;
    setWorkoutStartTime(null);
    setWorkoutState(WorkoutState.Idle);
  }, []);

  const value: WorkoutContextValue = {
    workoutState,
    canStart: workoutState === WorkoutState.Idle,
    canPause: workoutState === WorkoutState.Running,
    canResume: workoutState === WorkoutState.Paused,
    canStop:
      workoutState === WorkoutState.Running ||
      workoutState === WorkoutState.Paused,
    workoutStartTime,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    stopWorkout,
    resetWorkout,
  };

  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
}

/**
 * Hook to access Workout context.
 */
export function useWorkout(): WorkoutContextValue {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}
