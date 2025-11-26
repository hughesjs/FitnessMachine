import {
  DEFAULT_SPEED_RANGE,
  parseSupportedSpeedRange,
  isSpeedInRange,
  clampSpeed,
  roundToIncrement,
} from '../SupportedSpeedRange';

describe('SupportedSpeedRange', () => {
  describe('DEFAULT_SPEED_RANGE', () => {
    it('has sensible default values', () => {
      expect(DEFAULT_SPEED_RANGE.minSpeedInKmh).toBe(0.5);
      expect(DEFAULT_SPEED_RANGE.maxSpeedInKmh).toBe(12.0);
      expect(DEFAULT_SPEED_RANGE.minIncrementInKmh).toBe(0.1);
    });
  });

  describe('parseSupportedSpeedRange', () => {
    it('returns default for insufficient bytes', () => {
      const range = parseSupportedSpeedRange(new Uint8Array([0, 0, 0, 0, 0]));

      expect(range).toEqual(DEFAULT_SPEED_RANGE);
    });

    it('parses speed range from bytes', () => {
      // Min: 1.00 km/h = 100 = 0x0064
      // Max: 15.00 km/h = 1500 = 0x05DC
      // Increment: 0.10 km/h = 10 = 0x000A
      const bytes = new Uint8Array([
        0x64,
        0x00, // min
        0xdc,
        0x05, // max
        0x0a,
        0x00, // increment
      ]);
      const range = parseSupportedSpeedRange(bytes);

      expect(range.minSpeedInKmh).toBe(1.0);
      expect(range.maxSpeedInKmh).toBe(15.0);
      expect(range.minIncrementInKmh).toBe(0.1);
    });

    it('handles different increment values', () => {
      // Min: 0.50 km/h = 50 = 0x0032
      // Max: 20.00 km/h = 2000 = 0x07D0
      // Increment: 0.50 km/h = 50 = 0x0032
      const bytes = new Uint8Array([
        0x32,
        0x00, // min
        0xd0,
        0x07, // max
        0x32,
        0x00, // increment
      ]);
      const range = parseSupportedSpeedRange(bytes);

      expect(range.minSpeedInKmh).toBe(0.5);
      expect(range.maxSpeedInKmh).toBe(20.0);
      expect(range.minIncrementInKmh).toBe(0.5);
    });
  });

  describe('isSpeedInRange', () => {
    const range = {
      minSpeedInKmh: 1.0,
      maxSpeedInKmh: 10.0,
      minIncrementInKmh: 0.1,
    };

    it('returns true for speed within range', () => {
      expect(isSpeedInRange(5.0, range)).toBe(true);
    });

    it('returns true for minimum speed', () => {
      expect(isSpeedInRange(1.0, range)).toBe(true);
    });

    it('returns true for maximum speed', () => {
      expect(isSpeedInRange(10.0, range)).toBe(true);
    });

    it('returns false for speed below range', () => {
      expect(isSpeedInRange(0.5, range)).toBe(false);
    });

    it('returns false for speed above range', () => {
      expect(isSpeedInRange(10.5, range)).toBe(false);
    });
  });

  describe('clampSpeed', () => {
    const range = {
      minSpeedInKmh: 1.0,
      maxSpeedInKmh: 10.0,
      minIncrementInKmh: 0.1,
    };

    it('returns speed unchanged if within range', () => {
      expect(clampSpeed(5.0, range)).toBe(5.0);
    });

    it('clamps to minimum if below range', () => {
      expect(clampSpeed(0.5, range)).toBe(1.0);
    });

    it('clamps to maximum if above range', () => {
      expect(clampSpeed(15.0, range)).toBe(10.0);
    });

    it('handles edge case at minimum', () => {
      expect(clampSpeed(1.0, range)).toBe(1.0);
    });

    it('handles edge case at maximum', () => {
      expect(clampSpeed(10.0, range)).toBe(10.0);
    });
  });

  describe('roundToIncrement', () => {
    const range = {
      minSpeedInKmh: 0.5,
      maxSpeedInKmh: 12.0,
      minIncrementInKmh: 0.5,
    };

    it('rounds to nearest increment', () => {
      expect(roundToIncrement(5.3, range)).toBe(5.5);
    });

    it('rounds down when closer to lower increment', () => {
      expect(roundToIncrement(5.1, range)).toBe(5.0);
    });

    it('returns exact value if already on increment', () => {
      expect(roundToIncrement(5.0, range)).toBe(5.0);
    });

    it('handles zero increment gracefully', () => {
      const zeroIncrementRange = {...range, minIncrementInKmh: 0};
      expect(roundToIncrement(5.3, zeroIncrementRange)).toBe(5.3);
    });

    it('rounds 0.1 increment values correctly', () => {
      const smallIncrementRange = {...range, minIncrementInKmh: 0.1};
      expect(roundToIncrement(5.34, smallIncrementRange)).toBeCloseTo(5.3);
    });
  });
});
