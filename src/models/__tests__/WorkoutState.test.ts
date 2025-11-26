import {
  WorkoutState,
  isWorkoutActive,
  canStartWorkout,
  canPauseWorkout,
  canResumeWorkout,
  canStopWorkout,
} from '../WorkoutState';

describe('WorkoutState', () => {
  describe('enum values', () => {
    it('has correct string values', () => {
      expect(WorkoutState.Idle).toBe('idle');
      expect(WorkoutState.Running).toBe('running');
      expect(WorkoutState.Paused).toBe('paused');
    });
  });

  describe('isWorkoutActive', () => {
    it('returns false for Idle', () => {
      expect(isWorkoutActive(WorkoutState.Idle)).toBe(false);
    });

    it('returns true for Running', () => {
      expect(isWorkoutActive(WorkoutState.Running)).toBe(true);
    });

    it('returns true for Paused', () => {
      expect(isWorkoutActive(WorkoutState.Paused)).toBe(true);
    });
  });

  describe('canStartWorkout', () => {
    it('returns true only for Idle', () => {
      expect(canStartWorkout(WorkoutState.Idle)).toBe(true);
      expect(canStartWorkout(WorkoutState.Running)).toBe(false);
      expect(canStartWorkout(WorkoutState.Paused)).toBe(false);
    });
  });

  describe('canPauseWorkout', () => {
    it('returns true only for Running', () => {
      expect(canPauseWorkout(WorkoutState.Idle)).toBe(false);
      expect(canPauseWorkout(WorkoutState.Running)).toBe(true);
      expect(canPauseWorkout(WorkoutState.Paused)).toBe(false);
    });
  });

  describe('canResumeWorkout', () => {
    it('returns true only for Paused', () => {
      expect(canResumeWorkout(WorkoutState.Idle)).toBe(false);
      expect(canResumeWorkout(WorkoutState.Running)).toBe(false);
      expect(canResumeWorkout(WorkoutState.Paused)).toBe(true);
    });
  });

  describe('canStopWorkout', () => {
    it('returns false for Idle', () => {
      expect(canStopWorkout(WorkoutState.Idle)).toBe(false);
    });

    it('returns true for Running', () => {
      expect(canStopWorkout(WorkoutState.Running)).toBe(true);
    });

    it('returns true for Paused', () => {
      expect(canStopWorkout(WorkoutState.Paused)).toBe(true);
    });
  });
});
