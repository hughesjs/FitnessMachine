import React from 'react';
import {render} from '@testing-library/react-native';
import {BluetoothWarning} from '../BluetoothWarning';
import {BluetoothState} from '../../services/ble';

describe('BluetoothWarning', () => {
  it('does not render when Bluetooth is powered on', () => {
    const {queryByTestId} = render(
      <BluetoothWarning bluetoothState={BluetoothState.PoweredOn} />,
    );

    expect(queryByTestId('bluetooth-warning')).toBeNull();
  });

  it('renders warning when Bluetooth is powered off', () => {
    const {getByTestId, getByText} = render(
      <BluetoothWarning bluetoothState={BluetoothState.PoweredOff} />,
    );

    expect(getByTestId('bluetooth-warning')).toBeTruthy();
    expect(getByText('Bluetooth is turned off')).toBeTruthy();
  });

  it('renders warning when Bluetooth is unauthorized', () => {
    const {getByTestId, getByText} = render(
      <BluetoothWarning bluetoothState={BluetoothState.Unauthorized} />,
    );

    expect(getByTestId('bluetooth-warning')).toBeTruthy();
    expect(getByText('Bluetooth permission denied')).toBeTruthy();
  });

  it('renders warning when Bluetooth is unsupported', () => {
    const {getByTestId, getByText} = render(
      <BluetoothWarning bluetoothState={BluetoothState.Unsupported} />,
    );

    expect(getByTestId('bluetooth-warning')).toBeTruthy();
    expect(getByText('Bluetooth is not supported on this device')).toBeTruthy();
  });
});
