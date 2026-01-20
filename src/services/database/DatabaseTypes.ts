import {CompletedWorkout} from '../../models';

/**
 * Database row representation of a CompletedWorkout.
 * All dates stored as ISO strings for SQLite compatibility.
 */
export interface WorkoutRow {
  readonly workout_id: string;
  readonly distance_in_km: number;
  readonly total_steps: number;
  readonly workout_time_in_seconds: number;
  readonly machine_indicated_calories: number;
  readonly calculated_calories: number;
  readonly started_at: string;
  readonly completed_at: string;
}

/**
 * Converts a CompletedWorkout to a database row.
 */
export function workoutToRow(workout: CompletedWorkout): WorkoutRow {
  return {
    workout_id: workout.workoutId,
    distance_in_km: workout.distanceInKm,
    total_steps: workout.totalSteps,
    workout_time_in_seconds: workout.workoutTimeInSeconds,
    machine_indicated_calories: workout.machineIndicatedCalories,
    calculated_calories: workout.calculatedCalories,
    started_at: workout.startedAt.toISOString(),
    completed_at: workout.completedAt.toISOString(),
  };
}

/**
 * Converts a database row to a CompletedWorkout.
 */
export function rowToWorkout(row: WorkoutRow): CompletedWorkout {
  return {
    workoutId: row.workout_id,
    distanceInKm: row.distance_in_km,
    totalSteps: row.total_steps,
    workoutTimeInSeconds: row.workout_time_in_seconds,
    machineIndicatedCalories: row.machine_indicated_calories,
    calculatedCalories: row.calculated_calories,
    startedAt: new Date(row.started_at),
    completedAt: new Date(row.completed_at),
  };
}

/**
 * Database operation result type.
 */
export type DatabaseResult<T> =
  | {success: true; data: T}
  | {success: false; error: string};

/**
 * Creates a successful database result.
 */
export function dbSuccess<T>(data: T): DatabaseResult<T> {
  return {success: true, data};
}

/**
 * Creates a failed database result.
 */
export function dbError<T>(error: string): DatabaseResult<T> {
  return {success: false, error};
}
