/**
 * Represents the current state of a workout session.
 */
export enum WorkoutState {
  /** No workout is active */
  Idle = 'idle',
  /** Workout is currently running */
  Running = 'running',
  /** Workout is paused */
  Paused = 'paused',
}

/**
 * Checks if the workout is currently active (running or paused).
 */
export function isWorkoutActive(state: WorkoutState): boolean {
  return state === WorkoutState.Running || state === WorkoutState.Paused;
}

/**
 * Checks if the workout can be started.
 */
export function canStartWorkout(state: WorkoutState): boolean {
  return state === WorkoutState.Idle;
}

/**
 * Checks if the workout can be paused.
 */
export function canPauseWorkout(state: WorkoutState): boolean {
  return state === WorkoutState.Running;
}

/**
 * Checks if the workout can be resumed.
 */
export function canResumeWorkout(state: WorkoutState): boolean {
  return state === WorkoutState.Paused;
}

/**
 * Checks if the workout can be stopped.
 */
export function canStopWorkout(state: WorkoutState): boolean {
  return state === WorkoutState.Running || state === WorkoutState.Paused;
}
