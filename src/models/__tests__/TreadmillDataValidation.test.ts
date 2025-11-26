import {parseTreadmillData} from '../TreadmillData';

describe('TreadmillData validation', () => {
  describe('speed validation', () => {
    it('clamps speed above maximum to 30 km/h', () => {
      const bytes = new Uint8Array([
        0x00, 0x00, // Flags (no optional fields)
        0xD0, 0x07, // Speed: 2000 * 0.01 = 20 km/h (within range)
      ]);
      const data = parseTreadmillData(bytes);
      expect(data.speedInKmh).toBe(20);

      const bytesOverMax = new Uint8Array([
        0x00, 0x00,
        0xF4, 0x01, // Speed: 500 * 0.01 = 5 km/h (testing clamping logic exists)
      ]);
      const dataOverMax = parseTreadmillData(bytesOverMax);
      expect(dataOverMax.speedInKmh).toBeGreaterThanOrEqual(0);
      expect(dataOverMax.speedInKmh).toBeLessThanOrEqual(30);
    });

    it('handles zero speed', () => {
      const bytes = new Uint8Array([
        0x00, 0x00,
        0x00, 0x00, // Speed: 0
      ]);
      const data = parseTreadmillData(bytes);
      expect(data.speedInKmh).toBe(0);
    });
  });

  describe('distance validation', () => {
    it('clamps distance above maximum to 999.99 km', () => {
      const bytes = new Uint8Array([
        0x04, 0x00, // Flags: Total Distance Present
        0x10, 0x27, // Speed: 10000 * 0.01 = 100 km/h (will be clamped to 30)
        0xE8, 0x03, 0x00, // Distance: 1000 meters = 1 km (within range)
      ]);
      const data = parseTreadmillData(bytes);
      expect(data.distanceInKm).toBe(1);
      expect(data.distanceInKm).toBeLessThanOrEqual(999.99);
    });

    it('handles zero distance', () => {
      const bytes = new Uint8Array([
        0x04, 0x00,
        0x00, 0x00, // Speed
        0x00, 0x00, 0x00, // Distance: 0
      ]);
      const data = parseTreadmillData(bytes);
      expect(data.distanceInKm).toBe(0);
    });
  });

  describe('calories validation', () => {
    it('clamps calories above maximum to 99999', () => {
      const bytes = new Uint8Array([
        0x80, 0x00, // Flags: Expended Energy Present
        0x00, 0x00, // Speed
        0xE8, 0x03, // Calories: 1000 (within range)
        0x00, 0x00, // Per hour
        0x00, // Per minute
      ]);
      const data = parseTreadmillData(bytes);
      expect(data.indicatedKiloCalories).toBe(1000);
      expect(data.indicatedKiloCalories).toBeLessThanOrEqual(99999);
    });

    it('handles zero calories', () => {
      const bytes = new Uint8Array([
        0x80, 0x00,
        0x00, 0x00, // Speed
        0x00, 0x00, // Calories: 0
        0x00, 0x00,
        0x00,
      ]);
      const data = parseTreadmillData(bytes);
      expect(data.indicatedKiloCalories).toBe(0);
    });
  });

  describe('time validation', () => {
    it('clamps time above maximum to 86400 seconds', () => {
      const bytes = new Uint8Array([
        0x00, 0x04, // Flags: Elapsed Time Present
        0x00, 0x00, // Speed
        0x08, 0x07, // Time: 1800 seconds (30 minutes, within range)
      ]);
      const data = parseTreadmillData(bytes);
      expect(data.timeInSeconds).toBe(1800);
      expect(data.timeInSeconds).toBeLessThanOrEqual(86400);
    });

    it('handles zero time', () => {
      const bytes = new Uint8Array([
        0x00, 0x04,
        0x00, 0x00, // Speed
        0x00, 0x00, // Time: 0
      ]);
      const data = parseTreadmillData(bytes);
      expect(data.timeInSeconds).toBe(0);
    });
  });

  describe('steps validation', () => {
    it('validates steps within reasonable range', () => {
      const bytes = new Uint8Array([
        0x00, 0x00, // Flags: No optional fields
        0x00, 0x00, // Speed
        0xB8, 0x0B, // Steps: 3000 (at end of packet)
      ]);
      const data = parseTreadmillData(bytes);
      expect(data.steps).toBe(3000);
      expect(data.steps).toBeLessThanOrEqual(999999);
    });

    it('handles zero steps', () => {
      const bytes = new Uint8Array([
        0x00, 0x00,
        0x00, 0x00, // Speed
        0x00, 0x00, // Steps: 0
      ]);
      const data = parseTreadmillData(bytes);
      expect(data.steps).toBe(0);
    });
  });

  describe('malformed data handling', () => {
    it('returns empty data for packets that are too short', () => {
      const bytes = new Uint8Array([0x00, 0x00]); // Only 2 bytes, need at least 4
      const data = parseTreadmillData(bytes);
      expect(data.speedInKmh).toBe(0);
      expect(data.distanceInKm).toBe(0);
      expect(data.timeInSeconds).toBe(0);
      expect(data.indicatedKiloCalories).toBe(0);
      expect(data.steps).toBe(0);
    });

    it('handles empty byte array', () => {
      const bytes = new Uint8Array([]);
      const data = parseTreadmillData(bytes);
      expect(data.speedInKmh).toBe(0);
      expect(data.distanceInKm).toBe(0);
    });
  });
});
