import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {DeviceListItem} from '../DeviceListItem';
import {DeviceDescriptor} from '../../models';

describe('DeviceListItem', () => {
  const mockDevice: DeviceDescriptor = {
    deviceId: 'device-123',
    name: 'Test Treadmill',
    address: 'AA:BB:CC:DD:EE:FF',
    rssi: -55,
  };

  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders device name', () => {
    const {getByText} = render(
      <DeviceListItem device={mockDevice} onPress={mockOnPress} />,
    );

    expect(getByText('Test Treadmill')).toBeTruthy();
  });

  it('renders device address', () => {
    const {getByText} = render(
      <DeviceListItem device={mockDevice} onPress={mockOnPress} />,
    );

    expect(getByText('AA:BB:CC:DD:EE:FF')).toBeTruthy();
  });

  it('renders signal strength', () => {
    const {getByText} = render(
      <DeviceListItem device={mockDevice} onPress={mockOnPress} />,
    );

    expect(getByText('-55 dBm')).toBeTruthy();
  });

  it('renders N/A when rssi is undefined', () => {
    const deviceWithoutRssi: DeviceDescriptor = {
      deviceId: mockDevice.deviceId,
      name: mockDevice.name,
      address: mockDevice.address,
    };

    const {getByText} = render(
      <DeviceListItem device={deviceWithoutRssi} onPress={mockOnPress} />,
    );

    expect(getByText('N/A')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const {getByTestId} = render(
      <DeviceListItem device={mockDevice} onPress={mockOnPress} />,
    );

    fireEvent.press(getByTestId('device-item-device-123'));

    expect(mockOnPress).toHaveBeenCalledWith(mockDevice);
  });

  it('shows activity indicator when connecting', () => {
    const {queryByText} = render(
      <DeviceListItem device={mockDevice} onPress={mockOnPress} isConnecting />,
    );

    // Signal strength should be hidden when connecting
    expect(queryByText('-55 dBm')).toBeNull();
  });

  it('disables press when disabled', () => {
    const {getByTestId} = render(
      <DeviceListItem device={mockDevice} onPress={mockOnPress} disabled />,
    );

    fireEvent.press(getByTestId('device-item-device-123'));

    expect(mockOnPress).not.toHaveBeenCalled();
  });
});
