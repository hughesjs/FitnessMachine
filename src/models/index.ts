// Data models for the Fitness Machine app

export {
  type TreadmillData,
  createEmptyTreadmillData,
  parseTreadmillData,
  formatTime,
  formatDistance,
} from './TreadmillData';

export {
  type SupportedSpeedRange,
  DEFAULT_SPEED_RANGE,
  parseSupportedSpeedRange,
  isSpeedInRange,
  clampSpeed,
  roundToIncrement,
} from './SupportedSpeedRange';

export {
  type SpeedState,
  createSpeedState,
  createInitialSpeedState,
  getSpeedPercentage,
  canIncreaseSpeed,
  canDecreaseSpeed,
} from './SpeedState';

export {
  WorkoutState,
  isWorkoutActive,
  canStartWorkout,
  canPauseWorkout,
  canResumeWorkout,
  canStopWorkout,
} from './WorkoutState';

export {
  type CompletedWorkout,
  createCompletedWorkout,
  calculateCalories,
  generateWorkoutId,
  formatWorkoutDuration,
  formatWorkoutDate,
  formatWorkoutTime,
} from './CompletedWorkout';

export {
  type DeviceDescriptor,
  createDeviceDescriptor,
  getDeviceDisplayName,
  isSameDevice,
  sortDevicesBySignal,
} from './DeviceDescriptor';
