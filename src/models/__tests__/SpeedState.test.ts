import {
  createSpeedState,
  createInitialSpeedState,
  getSpeedPercentage,
  canIncreaseSpeed,
  canDecreaseSpeed,
} from '../SpeedState';
import {DEFAULT_SPEED_RANGE} from '../SupportedSpeedRange';

describe('SpeedState', () => {
  describe('createSpeedState', () => {
    it('creates state with given speed and default range', () => {
      const state = createSpeedState(5.0);

      expect(state.speedInKmh).toBe(5.0);
      expect(state.minSpeed).toBe(DEFAULT_SPEED_RANGE.minSpeedInKmh);
      expect(state.maxSpeed).toBe(DEFAULT_SPEED_RANGE.maxSpeedInKmh);
    });

    it('creates state with custom range', () => {
      const range = {
        minSpeedInKmh: 1.0,
        maxSpeedInKmh: 20.0,
        minIncrementInKmh: 0.5,
      };
      const state = createSpeedState(10.0, range);

      expect(state.speedInKmh).toBe(10.0);
      expect(state.minSpeed).toBe(1.0);
      expect(state.maxSpeed).toBe(20.0);
    });
  });

  describe('createInitialSpeedState', () => {
    it('creates state with zero speed', () => {
      const state = createInitialSpeedState();

      expect(state.speedInKmh).toBe(0);
    });

    it('uses default speed range', () => {
      const state = createInitialSpeedState();

      expect(state.minSpeed).toBe(DEFAULT_SPEED_RANGE.minSpeedInKmh);
      expect(state.maxSpeed).toBe(DEFAULT_SPEED_RANGE.maxSpeedInKmh);
    });
  });

  describe('getSpeedPercentage', () => {
    it('returns 0 for minimum speed', () => {
      const state = {speedInKmh: 1.0, minSpeed: 1.0, maxSpeed: 10.0};
      expect(getSpeedPercentage(state)).toBe(0);
    });

    it('returns 1 for maximum speed', () => {
      const state = {speedInKmh: 10.0, minSpeed: 1.0, maxSpeed: 10.0};
      expect(getSpeedPercentage(state)).toBe(1);
    });

    it('returns 0.5 for middle speed', () => {
      const state = {speedInKmh: 5.5, minSpeed: 1.0, maxSpeed: 10.0};
      expect(getSpeedPercentage(state)).toBe(0.5);
    });

    it('clamps to 0 for below minimum', () => {
      const state = {speedInKmh: 0, minSpeed: 1.0, maxSpeed: 10.0};
      expect(getSpeedPercentage(state)).toBe(0);
    });

    it('clamps to 1 for above maximum', () => {
      const state = {speedInKmh: 15.0, minSpeed: 1.0, maxSpeed: 10.0};
      expect(getSpeedPercentage(state)).toBe(1);
    });

    it('handles zero range gracefully', () => {
      const state = {speedInKmh: 5.0, minSpeed: 5.0, maxSpeed: 5.0};
      expect(getSpeedPercentage(state)).toBe(0);
    });
  });

  describe('canIncreaseSpeed', () => {
    it('returns true when below max', () => {
      const state = {speedInKmh: 5.0, minSpeed: 1.0, maxSpeed: 10.0};
      expect(canIncreaseSpeed(state)).toBe(true);
    });

    it('returns false at max speed', () => {
      const state = {speedInKmh: 10.0, minSpeed: 1.0, maxSpeed: 10.0};
      expect(canIncreaseSpeed(state)).toBe(false);
    });

    it('returns false above max speed', () => {
      const state = {speedInKmh: 12.0, minSpeed: 1.0, maxSpeed: 10.0};
      expect(canIncreaseSpeed(state)).toBe(false);
    });
  });

  describe('canDecreaseSpeed', () => {
    it('returns true when above min', () => {
      const state = {speedInKmh: 5.0, minSpeed: 1.0, maxSpeed: 10.0};
      expect(canDecreaseSpeed(state)).toBe(true);
    });

    it('returns false at min speed', () => {
      const state = {speedInKmh: 1.0, minSpeed: 1.0, maxSpeed: 10.0};
      expect(canDecreaseSpeed(state)).toBe(false);
    });

    it('returns false below min speed', () => {
      const state = {speedInKmh: 0.5, minSpeed: 1.0, maxSpeed: 10.0};
      expect(canDecreaseSpeed(state)).toBe(false);
    });
  });
});
