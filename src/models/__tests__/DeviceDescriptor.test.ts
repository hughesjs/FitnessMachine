import {
  createDeviceDescriptor,
  getDeviceDisplayName,
  isSameDevice,
  sortDevicesBySignal,
  DeviceDescriptor,
} from '../DeviceDescriptor';

describe('DeviceDescriptor', () => {
  describe('createDeviceDescriptor', () => {
    it('creates descriptor with all fields', () => {
      const descriptor = createDeviceDescriptor({
        deviceId: 'device-123',
        name: 'My Treadmill',
        address: 'AA:BB:CC:DD:EE:FF',
        rssi: -45,
      });

      expect(descriptor.deviceId).toBe('device-123');
      expect(descriptor.name).toBe('My Treadmill');
      expect(descriptor.address).toBe('AA:BB:CC:DD:EE:FF');
      expect(descriptor.rssi).toBe(-45);
    });

    it('uses "Unknown Device" for empty name', () => {
      const descriptor = createDeviceDescriptor({
        deviceId: 'device-123',
        name: '',
        address: 'AA:BB:CC:DD:EE:FF',
      });

      expect(descriptor.name).toBe('Unknown Device');
    });

    it('allows undefined rssi', () => {
      const descriptor = createDeviceDescriptor({
        deviceId: 'device-123',
        name: 'My Treadmill',
        address: 'AA:BB:CC:DD:EE:FF',
      });

      expect(descriptor.rssi).toBeUndefined();
    });
  });

  describe('getDeviceDisplayName', () => {
    it('returns device name when available', () => {
      const device: DeviceDescriptor = {
        deviceId: '123',
        name: 'My Treadmill',
        address: 'AABBCCDDEEFF',
      };

      expect(getDeviceDisplayName(device)).toBe('My Treadmill');
    });

    it('formats MAC address when name is Unknown Device', () => {
      const device: DeviceDescriptor = {
        deviceId: '123',
        name: 'Unknown Device',
        address: 'AABBCCDDEEFF',
      };

      expect(getDeviceDisplayName(device)).toBe('AA:BB:CC:DD:EE:FF');
    });

    it('returns address as-is if not a MAC format', () => {
      const device: DeviceDescriptor = {
        deviceId: '123',
        name: 'Unknown Device',
        address: 'some-identifier',
      };

      expect(getDeviceDisplayName(device)).toBe('some-identifier');
    });

    it('handles empty name by returning formatted address', () => {
      const device: DeviceDescriptor = {
        deviceId: '123',
        name: '',
        address: 'AABBCCDDEEFF',
      };

      // Empty string is falsy, so should format address
      expect(getDeviceDisplayName(device)).toBe('AA:BB:CC:DD:EE:FF');
    });
  });

  describe('isSameDevice', () => {
    it('returns true for same deviceId', () => {
      const a: DeviceDescriptor = {
        deviceId: '123',
        name: 'Device A',
        address: 'addr1',
      };
      const b: DeviceDescriptor = {
        deviceId: '123',
        name: 'Device B',
        address: 'addr2',
      };

      expect(isSameDevice(a, b)).toBe(true);
    });

    it('returns false for different deviceId', () => {
      const a: DeviceDescriptor = {
        deviceId: '123',
        name: 'Device A',
        address: 'addr1',
      };
      const b: DeviceDescriptor = {
        deviceId: '456',
        name: 'Device A',
        address: 'addr1',
      };

      expect(isSameDevice(a, b)).toBe(false);
    });
  });

  describe('sortDevicesBySignal', () => {
    it('sorts devices by RSSI descending', () => {
      const devices: DeviceDescriptor[] = [
        {deviceId: '1', name: 'A', address: 'a', rssi: -70},
        {deviceId: '2', name: 'B', address: 'b', rssi: -40},
        {deviceId: '3', name: 'C', address: 'c', rssi: -55},
      ];

      const sorted = sortDevicesBySignal(devices);

      expect(sorted[0]?.deviceId).toBe('2'); // -40 (strongest)
      expect(sorted[1]?.deviceId).toBe('3'); // -55
      expect(sorted[2]?.deviceId).toBe('1'); // -70 (weakest)
    });

    it('treats undefined rssi as very weak signal', () => {
      const devices: DeviceDescriptor[] = [
        {deviceId: '1', name: 'A', address: 'a'},
        {deviceId: '2', name: 'B', address: 'b', rssi: -60},
      ];

      const sorted = sortDevicesBySignal(devices);

      expect(sorted[0]?.deviceId).toBe('2'); // -60
      expect(sorted[1]?.deviceId).toBe('1'); // undefined treated as -100
    });

    it('does not modify original array', () => {
      const devices: DeviceDescriptor[] = [
        {deviceId: '1', name: 'A', address: 'a', rssi: -70},
        {deviceId: '2', name: 'B', address: 'b', rssi: -40},
      ];

      const sorted = sortDevicesBySignal(devices);

      expect(devices[0]?.deviceId).toBe('1'); // Original unchanged
      expect(sorted[0]?.deviceId).toBe('2');
    });

    it('handles empty array', () => {
      const sorted = sortDevicesBySignal([]);
      expect(sorted).toEqual([]);
    });

    it('handles single device', () => {
      const devices: DeviceDescriptor[] = [
        {deviceId: '1', name: 'A', address: 'a', rssi: -50},
      ];

      const sorted = sortDevicesBySignal(devices);
      expect(sorted).toHaveLength(1);
      expect(sorted[0]?.deviceId).toBe('1');
    });
  });
});
