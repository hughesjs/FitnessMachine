/**
 * Represents a completed workout session that has been saved.
 */
export interface CompletedWorkout {
  /** Unique identifier for the workout */
  readonly workoutId: string;
  /** Total distance covered in kilometers */
  readonly distanceInKm: number;
  /** Total steps taken */
  readonly totalSteps: number;
  /** Total workout duration in seconds */
  readonly workoutTimeInSeconds: number;
  /** Calories as indicated by the machine */
  readonly machineIndicatedCalories: number;
  /** Calories calculated based on user metrics */
  readonly calculatedCalories: number;
  /** When the workout started */
  readonly startedAt: Date;
  /** When the workout was completed */
  readonly completedAt: Date;
}

/**
 * Creates a new CompletedWorkout with the given parameters.
 */
export function createCompletedWorkout(params: {
  workoutId: string;
  distanceInKm: number;
  totalSteps: number;
  workoutTimeInSeconds: number;
  machineIndicatedCalories: number;
  calculatedCalories: number;
  startedAt: Date;
  completedAt: Date;
}): CompletedWorkout {
  return {
    workoutId: params.workoutId,
    distanceInKm: params.distanceInKm,
    totalSteps: params.totalSteps,
    workoutTimeInSeconds: params.workoutTimeInSeconds,
    machineIndicatedCalories: params.machineIndicatedCalories,
    calculatedCalories: params.calculatedCalories,
    startedAt: params.startedAt,
    completedAt: params.completedAt,
  };
}

/**
 * Calculates estimated calories burned based on workout data.
 *
 * Uses a simplified MET (Metabolic Equivalent of Task) formula:
 * Calories = MET × weight (kg) × duration (hours)
 *
 * MET values for walking/running:
 * - 3.5 km/h: 3.0 MET
 * - 5.0 km/h: 3.8 MET
 * - 6.4 km/h: 5.0 MET
 * - 8.0 km/h: 8.3 MET
 * - 9.7 km/h: 9.8 MET
 * - 12.0 km/h: 11.5 MET
 *
 * We approximate MET based on average speed.
 */
export function calculateCalories(
  distanceKm: number,
  durationSeconds: number,
  weightKg: number = 80,
): number {
  if (durationSeconds <= 0) {
    return 0;
  }

  const durationHours = durationSeconds / 3600;
  const averageSpeedKmh = distanceKm / durationHours;

  // Approximate MET based on speed
  let met: number;
  if (averageSpeedKmh <= 3.5) {
    met = 3.0;
  } else if (averageSpeedKmh <= 5.0) {
    met = 3.8;
  } else if (averageSpeedKmh <= 6.4) {
    met = 5.0;
  } else if (averageSpeedKmh <= 8.0) {
    met = 8.3;
  } else if (averageSpeedKmh <= 9.7) {
    met = 9.8;
  } else {
    met = 11.5;
  }

  return Math.round(met * weightKg * durationHours);
}

/**
 * Generates a unique workout ID.
 */
export function generateWorkoutId(): string {
  return `workout-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Formats a completed workout's duration for display.
 */
export function formatWorkoutDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

/**
 * Formats the workout date for display.
 */
export function formatWorkoutDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats the workout time for display.
 */
export function formatWorkoutTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}
