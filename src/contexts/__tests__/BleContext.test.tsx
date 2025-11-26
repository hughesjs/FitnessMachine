import React from 'react';
import {renderHook, act, waitFor} from '@testing-library/react-native';
import {BleProvider, useBle} from '../BleContext';
import {MockBleService} from '../../services/ble';
import {BluetoothState, ConnectionState} from '../../services/ble/BleTypes';
import {createDeviceDescriptor, DEFAULT_SPEED_RANGE} from '../../models';

describe('BleContext', () => {
  let bleService: MockBleService;

  beforeEach(async () => {
    bleService = new MockBleService();
    await bleService.initialize();
  });

  const wrapper = ({children}: {children: React.ReactNode}) => (
    <BleProvider bleService={bleService}>{children}</BleProvider>
  );

  describe('initialization', () => {
    it('initializes with correct default state', async () => {
      const {result} = renderHook(() => useBle(), {wrapper});

      await waitFor(() => {
        expect(result.current.bluetoothState).toBe(BluetoothState.PoweredOn);
      });

      expect(result.current.isBluetoothReady).toBe(true);
      expect(result.current.connectionState).toBe(ConnectionState.Disconnected);
      expect(result.current.isConnected).toBe(false);
      expect(result.current.connectedDevice).toBeNull();
      expect(result.current.isScanning).toBe(false);
      expect(result.current.discoveredDevices).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe('device scanning', () => {
    it('starts scanning for devices', () => {
      const {result} = renderHook(() => useBle(), {wrapper});

      act(() => {
        result.current.startScan();
      });

      expect(result.current.isScanning).toBe(true);
      expect(bleService.isScanning()).toBe(true);
    });

    it('stops scanning for devices', () => {
      const {result} = renderHook(() => useBle(), {wrapper});

      act(() => {
        result.current.startScan();
        result.current.stopScan();
      });

      expect(result.current.isScanning).toBe(false);
      expect(bleService.isScanning()).toBe(false);
    });

    it('discovers mock devices during scan', async () => {
      const {result} = renderHook(() => useBle(), {wrapper});

      act(() => {
        result.current.startScan();
      });

      await waitFor(() => {
        expect(result.current.discoveredDevices.length).toBeGreaterThan(0);
      }, {timeout: 3000});
    });
  });

  describe('device connection', () => {
    it('connects to a device successfully', async () => {
      const {result} = renderHook(() => useBle(), {wrapper});

      const device = createDeviceDescriptor({
        deviceId: 'device-1',
        name: 'Treadmill 1',
        address: 'AA:BB:CC:DD:EE:FF',
      });

      let success = false;
      await act(async () => {
        success = await result.current.connectToDevice(device);
      });

      expect(success).toBe(true);
      expect(result.current.isConnected).toBe(true);
      expect(result.current.connectedDevice).toBeDefined();
      expect(result.current.connectedDevice?.device.deviceId).toBe('device-1');
    });

    it('stops scanning when connecting', async () => {
      const {result} = renderHook(() => useBle(), {wrapper});

      const device = createDeviceDescriptor({
        deviceId: 'device-1',
        name: 'Treadmill 1',
        address: 'AA:BB:CC:DD:EE:FF',
      });

      act(() => {
        result.current.startScan();
      });

      expect(result.current.isScanning).toBe(true);

      await act(async () => {
        await result.current.connectToDevice(device);
      });

      expect(result.current.isScanning).toBe(false);
    });

    it('reads speed range after connection', async () => {
      const {result} = renderHook(() => useBle(), {wrapper});

      const device = createDeviceDescriptor({
        deviceId: 'device-1',
        name: 'Treadmill 1',
        address: 'AA:BB:CC:DD:EE:FF',
      });

      await act(async () => {
        await result.current.connectToDevice(device);
      });

      expect(result.current.speedRange).toEqual(DEFAULT_SPEED_RANGE);
    });

    it('subscribes to treadmill data after connection', async () => {
      const {result} = renderHook(() => useBle(), {wrapper});

      const device = createDeviceDescriptor({
        deviceId: 'device-1',
        name: 'Treadmill 1',
        address: 'AA:BB:CC:DD:EE:FF',
      });

      await act(async () => {
        await result.current.connectToDevice(device);
      });

      expect(result.current.treadmillData).toBeDefined();
    });
  });

  describe('device disconnection', () => {
    it('disconnects from a device', async () => {
      const {result} = renderHook(() => useBle(), {wrapper});

      const device = createDeviceDescriptor({
        deviceId: 'device-1',
        name: 'Treadmill 1',
        address: 'AA:BB:CC:DD:EE:FF',
      });

      await act(async () => {
        await result.current.connectToDevice(device);
      });

      expect(result.current.isConnected).toBe(true);

      await act(async () => {
        await result.current.disconnect();
      });

      expect(result.current.isConnected).toBe(false);
      expect(result.current.connectedDevice).toBeNull();
    });

    it('resets treadmill data on disconnect', async () => {
      const {result} = renderHook(() => useBle(), {wrapper});

      const device = createDeviceDescriptor({
        deviceId: 'device-1',
        name: 'Treadmill 1',
        address: 'AA:BB:CC:DD:EE:FF',
      });

      await act(async () => {
        await result.current.connectToDevice(device);
        await result.current.disconnect();
      });

      expect(result.current.treadmillData.speedInKmh).toBe(0);
      expect(result.current.treadmillData.distanceInKm).toBe(0);
    });

    it('resets speed range on disconnect', async () => {
      const {result} = renderHook(() => useBle(), {wrapper});

      const device = createDeviceDescriptor({
        deviceId: 'device-1',
        name: 'Treadmill 1',
        address: 'AA:BB:CC:DD:EE:FF',
      });

      await act(async () => {
        await result.current.connectToDevice(device);
        await result.current.disconnect();
      });

      expect(result.current.speedRange).toEqual(DEFAULT_SPEED_RANGE);
    });
  });

  describe('control commands', () => {
    it('requests control successfully', async () => {
      const {result} = renderHook(() => useBle(), {wrapper});

      const device = createDeviceDescriptor({
        deviceId: 'device-1',
        name: 'Treadmill 1',
        address: 'AA:BB:CC:DD:EE:FF',
      });

      await act(async () => {
        await result.current.connectToDevice(device);
      });

      let success = false;
      await act(async () => {
        success = await result.current.requestControl();
      });

      expect(success).toBe(true);
    });

    it('starts workout successfully', async () => {
      const {result} = renderHook(() => useBle(), {wrapper});

      const device = createDeviceDescriptor({
        deviceId: 'device-1',
        name: 'Treadmill 1',
        address: 'AA:BB:CC:DD:EE:FF',
      });

      await act(async () => {
        await result.current.connectToDevice(device);
      });

      let success = false;
      await act(async () => {
        success = await result.current.startWorkout();
      });

      expect(success).toBe(true);
    });

    it('stops workout successfully', async () => {
      const {result} = renderHook(() => useBle(), {wrapper});

      const device = createDeviceDescriptor({
        deviceId: 'device-1',
        name: 'Treadmill 1',
        address: 'AA:BB:CC:DD:EE:FF',
      });

      await act(async () => {
        await result.current.connectToDevice(device);
      });

      let success = false;
      await act(async () => {
        success = await result.current.stopWorkout();
      });

      expect(success).toBe(true);
    });

    it('pauses workout successfully', async () => {
      const {result} = renderHook(() => useBle(), {wrapper});

      const device = createDeviceDescriptor({
        deviceId: 'device-1',
        name: 'Treadmill 1',
        address: 'AA:BB:CC:DD:EE:FF',
      });

      await act(async () => {
        await result.current.connectToDevice(device);
      });

      let success = false;
      await act(async () => {
        success = await result.current.pauseWorkout();
      });

      expect(success).toBe(true);
    });

    it('sets target speed successfully', async () => {
      const {result} = renderHook(() => useBle(), {wrapper});

      const device = createDeviceDescriptor({
        deviceId: 'device-1',
        name: 'Treadmill 1',
        address: 'AA:BB:CC:DD:EE:FF',
      });

      await act(async () => {
        await result.current.connectToDevice(device);
      });

      let success = false;
      await act(async () => {
        success = await result.current.setTargetSpeed(8.0);
      });

      expect(success).toBe(true);
    });
  });

  describe('error handling', () => {
    it('clears error when clearError is called', () => {
      const {result} = renderHook(() => useBle(), {wrapper});

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
