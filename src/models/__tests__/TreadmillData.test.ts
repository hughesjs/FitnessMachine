import {
  createEmptyTreadmillData,
  parseTreadmillData,
  formatTime,
  formatDistance,
} from '../TreadmillData';

describe('TreadmillData', () => {
  describe('createEmptyTreadmillData', () => {
    it('creates data with all zero values', () => {
      const data = createEmptyTreadmillData();

      expect(data.speedInKmh).toBe(0);
      expect(data.distanceInKm).toBe(0);
      expect(data.timeInSeconds).toBe(0);
      expect(data.indicatedKiloCalories).toBe(0);
      expect(data.steps).toBe(0);
    });
  });

  describe('parseTreadmillData', () => {
    it('returns empty data for insufficient bytes', () => {
      const data = parseTreadmillData(new Uint8Array([0, 0, 0]));

      expect(data.speedInKmh).toBe(0);
    });

    it('parses speed from bytes 2-3', () => {
      // Speed of 5.00 km/h = 500 in 0.01 km/h units = 0x01F4
      const bytes = new Uint8Array([0, 0, 0xf4, 0x01]);
      const data = parseTreadmillData(bytes);

      expect(data.speedInKmh).toBe(5.0);
    });

    it('parses speed correctly for different values', () => {
      // Speed of 10.50 km/h = 1050 = 0x041A
      const bytes = new Uint8Array([0, 0, 0x1a, 0x04]);
      const data = parseTreadmillData(bytes);

      expect(data.speedInKmh).toBe(10.5);
    });

    it('parses distance when flag is set', () => {
      // Flags: 0x0004 (distance present)
      // Speed: 5.00 km/h = 0x01F4
      // Distance: 1500 meters = 0x0005DC
      const bytes = new Uint8Array([
        0x04,
        0x00, // flags
        0xf4,
        0x01, // speed
        0xdc,
        0x05,
        0x00, // distance (24-bit)
      ]);
      const data = parseTreadmillData(bytes);

      expect(data.speedInKmh).toBe(5.0);
      expect(data.distanceInKm).toBe(1.5);
    });

    it('parses elapsed time when flag is set', () => {
      // Flags: 0x0400 (elapsed time present)
      // Speed: 6.00 km/h = 0x0258
      // Time: 300 seconds = 0x012C
      const bytes = new Uint8Array([
        0x00,
        0x04, // flags (bit 10 set)
        0x58,
        0x02, // speed
        0x2c,
        0x01, // time
      ]);
      const data = parseTreadmillData(bytes);

      expect(data.speedInKmh).toBe(6.0);
      expect(data.timeInSeconds).toBe(300);
    });

    it('parses calories when flag is set', () => {
      // Flags: 0x0080 (expended energy present)
      // Speed: 8.00 km/h = 0x0320
      // Calories: 150 kcal = 0x0096
      const bytes = new Uint8Array([
        0x80,
        0x00, // flags (bit 7 set)
        0x20,
        0x03, // speed
        0x96,
        0x00, // total energy
        0x00,
        0x00, // per hour
        0x00, // per minute
      ]);
      const data = parseTreadmillData(bytes);

      expect(data.speedInKmh).toBe(8.0);
      expect(data.indicatedKiloCalories).toBe(150);
    });
  });

  describe('formatTime', () => {
    it('formats seconds only', () => {
      expect(formatTime(45)).toBe('0:45');
    });

    it('formats minutes and seconds', () => {
      expect(formatTime(125)).toBe('2:05');
    });

    it('formats hours, minutes, and seconds', () => {
      expect(formatTime(3725)).toBe('1:02:05');
    });

    it('handles zero', () => {
      expect(formatTime(0)).toBe('0:00');
    });

    it('handles exactly one hour', () => {
      expect(formatTime(3600)).toBe('1:00:00');
    });
  });

  describe('formatDistance', () => {
    it('formats distance with two decimal places', () => {
      expect(formatDistance(1.5)).toBe('1.50');
    });

    it('formats zero distance', () => {
      expect(formatDistance(0)).toBe('0.00');
    });

    it('formats large distances', () => {
      expect(formatDistance(10.123)).toBe('10.12');
    });

    it('rounds correctly', () => {
      expect(formatDistance(1.999)).toBe('2.00');
    });
  });
});
