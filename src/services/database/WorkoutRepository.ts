import {CompletedWorkout} from '../../models';
import {DatabaseResult} from './DatabaseTypes';

/**
 * Repository interface for CompletedWorkout persistence.
 */
export interface WorkoutRepository {
  /**
   * Initialize the database and create tables if needed.
   */
  initialize(): Promise<void>;

  /**
   * Close the database connection.
   */
  close(): Promise<void>;

  /**
   * Save a completed workout.
   */
  saveWorkout(workout: CompletedWorkout): Promise<DatabaseResult<void>>;

  /**
   * Get all completed workouts, ordered by completion date (newest first).
   */
  getAllWorkouts(): Promise<DatabaseResult<CompletedWorkout[]>>;

  /**
   * Get a single workout by ID.
   */
  getWorkoutById(workoutId: string): Promise<DatabaseResult<CompletedWorkout | null>>;

  /**
   * Delete a workout by ID.
   */
  deleteWorkout(workoutId: string): Promise<DatabaseResult<void>>;

  /**
   * Delete all workouts.
   */
  deleteAllWorkouts(): Promise<DatabaseResult<void>>;

  /**
   * Get the total count of workouts.
   */
  getWorkoutCount(): Promise<DatabaseResult<number>>;
}
