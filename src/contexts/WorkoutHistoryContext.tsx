import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {CompletedWorkout} from '../models';
import {WorkoutRepository} from '../services/database';

/**
 * State provided by the WorkoutHistory context.
 */
interface WorkoutHistoryContextState {
  /** List of completed workouts */
  workouts: CompletedWorkout[];
  /** Whether workouts are being loaded */
  isLoading: boolean;
  /** Error message if loading failed */
  error: string | null;
}

/**
 * Actions provided by the WorkoutHistory context.
 */
interface WorkoutHistoryContextActions {
  /** Refresh the workout list */
  refresh: () => Promise<void>;
  /** Delete a workout by ID */
  deleteWorkout: (workoutId: string) => Promise<boolean>;
  /** Delete all workouts */
  deleteAllWorkouts: () => Promise<boolean>;
  /** Add a workout to the list (used after completing a workout) */
  addWorkout: (workout: CompletedWorkout) => void;
}

export type WorkoutHistoryContextValue = WorkoutHistoryContextState &
  WorkoutHistoryContextActions;

export const WorkoutHistoryContext = createContext<WorkoutHistoryContextValue | null>(
  null,
);

interface WorkoutHistoryProviderProps {
  children: ReactNode;
  workoutRepository: WorkoutRepository;
}

/**
 * Provider component for workout history management.
 */
export function WorkoutHistoryProvider({
  children,
  workoutRepository,
}: WorkoutHistoryProviderProps): React.JSX.Element {
  const [workouts, setWorkouts] = useState<CompletedWorkout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    const result = await workoutRepository.getAllWorkouts();

    if (result.success) {
      setWorkouts(result.data);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  }, [workoutRepository]);

  // Load workouts on mount
  useEffect(() => {
    refresh().catch(error => {
      console.error('Failed to load workouts on mount:', error);
    });
  }, [refresh]);

  const deleteWorkout = useCallback(
    async (workoutId: string): Promise<boolean> => {
      const result = await workoutRepository.deleteWorkout(workoutId);

      if (result.success) {
        setWorkouts(prev => prev.filter(w => w.workoutId !== workoutId));
        return true;
      }

      setError(result.error);
      return false;
    },
    [workoutRepository],
  );

  const deleteAllWorkouts = useCallback(async (): Promise<boolean> => {
    const result = await workoutRepository.deleteAllWorkouts();

    if (result.success) {
      setWorkouts([]);
      return true;
    }

    setError(result.error);
    return false;
  }, [workoutRepository]);

  const addWorkout = useCallback((workout: CompletedWorkout): void => {
    setWorkouts(prev => {
      // Add at the beginning (newest first)
      const updated = [workout, ...prev];
      // Re-sort by completion date just in case
      updated.sort(
        (a, b) => b.completedAt.getTime() - a.completedAt.getTime(),
      );
      return updated;
    });
  }, []);

  const value: WorkoutHistoryContextValue = {
    workouts,
    isLoading,
    error,
    refresh,
    deleteWorkout,
    deleteAllWorkouts,
    addWorkout,
  };

  return (
    <WorkoutHistoryContext.Provider value={value}>
      {children}
    </WorkoutHistoryContext.Provider>
  );
}

/**
 * Hook to access WorkoutHistory context.
 */
export function useWorkoutHistory(): WorkoutHistoryContextValue {
  const context = useContext(WorkoutHistoryContext);
  if (!context) {
    throw new Error(
      'useWorkoutHistory must be used within a WorkoutHistoryProvider',
    );
  }
  return context;
}
