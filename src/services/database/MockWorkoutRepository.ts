import {CompletedWorkout} from '../../models';
import {WorkoutRepository} from './WorkoutRepository';
import {DatabaseResult, dbSuccess, dbError} from './DatabaseTypes';

/**
 * In-memory mock implementation of WorkoutRepository for testing.
 */
export class MockWorkoutRepository implements WorkoutRepository {
  private workouts: Map<string, CompletedWorkout> = new Map();
  private initialized = false;

  async initialize(): Promise<void> {
    this.initialized = true;
  }

  async close(): Promise<void> {
    this.initialized = false;
  }

  async saveWorkout(workout: CompletedWorkout): Promise<DatabaseResult<void>> {
    if (!this.initialized) {
      return dbError('Database not initialized');
    }

    this.workouts.set(workout.workoutId, workout);
    return dbSuccess(undefined);
  }

  async getAllWorkouts(): Promise<DatabaseResult<CompletedWorkout[]>> {
    if (!this.initialized) {
      return dbError('Database not initialized');
    }

    const workouts = Array.from(this.workouts.values());
    // Sort by completion date, newest first
    workouts.sort(
      (a, b) => b.completedAt.getTime() - a.completedAt.getTime(),
    );
    return dbSuccess(workouts);
  }

  async getWorkoutById(
    workoutId: string,
  ): Promise<DatabaseResult<CompletedWorkout | null>> {
    if (!this.initialized) {
      return dbError('Database not initialized');
    }

    const workout = this.workouts.get(workoutId) ?? null;
    return dbSuccess(workout);
  }

  async deleteWorkout(workoutId: string): Promise<DatabaseResult<void>> {
    if (!this.initialized) {
      return dbError('Database not initialized');
    }

    this.workouts.delete(workoutId);
    return dbSuccess(undefined);
  }

  async deleteAllWorkouts(): Promise<DatabaseResult<void>> {
    if (!this.initialized) {
      return dbError('Database not initialized');
    }

    this.workouts.clear();
    return dbSuccess(undefined);
  }

  async getWorkoutCount(): Promise<DatabaseResult<number>> {
    if (!this.initialized) {
      return dbError('Database not initialized');
    }

    return dbSuccess(this.workouts.size);
  }

  /**
   * Helper for testing: add workouts directly.
   */
  addWorkouts(workouts: CompletedWorkout[]): void {
    for (const workout of workouts) {
      this.workouts.set(workout.workoutId, workout);
    }
  }

  /**
   * Helper for testing: clear all workouts.
   */
  clear(): void {
    this.workouts.clear();
  }
}
