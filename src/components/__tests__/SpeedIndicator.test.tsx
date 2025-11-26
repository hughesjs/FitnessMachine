import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {SpeedIndicator} from '../SpeedIndicator';
import {SpeedState} from '../../models';

describe('SpeedIndicator', () => {
  const createSpeedState = (speed: number, min = 0.5, max = 16.0): SpeedState => ({
    speedInKmh: speed,
    minSpeed: min,
    maxSpeed: max,
  });

  const mockOnSpeedUp = jest.fn();
  const mockOnSpeedDown = jest.fn();

  beforeEach(() => {
    mockOnSpeedUp.mockClear();
    mockOnSpeedDown.mockClear();
  });

  it('renders the speed indicator container', () => {
    const speedState = createSpeedState(5.0);
    const {getByTestId} = render(
      <SpeedIndicator
        speedState={speedState}
        onSpeedUp={mockOnSpeedUp}
        onSpeedDown={mockOnSpeedDown}
      />,
    );

    expect(getByTestId('speed-indicator')).toBeTruthy();
  });

  it('displays current speed with one decimal place', () => {
    const speedState = createSpeedState(7.5);
    const {getByText} = render(
      <SpeedIndicator
        speedState={speedState}
        onSpeedUp={mockOnSpeedUp}
        onSpeedDown={mockOnSpeedDown}
      />,
    );

    expect(getByText('7.5')).toBeTruthy();
    expect(getByText('km/h')).toBeTruthy();
  });

  it('displays min and max speed labels', () => {
    const speedState = createSpeedState(5.0, 1.0, 20.0);
    const {getByText} = render(
      <SpeedIndicator
        speedState={speedState}
        onSpeedUp={mockOnSpeedUp}
        onSpeedDown={mockOnSpeedDown}
      />,
    );

    expect(getByText('1.0')).toBeTruthy();
    expect(getByText('20.0')).toBeTruthy();
  });

  it('renders speed up and down buttons', () => {
    const speedState = createSpeedState(5.0);
    const {getByTestId} = render(
      <SpeedIndicator
        speedState={speedState}
        onSpeedUp={mockOnSpeedUp}
        onSpeedDown={mockOnSpeedDown}
      />,
    );

    expect(getByTestId('speed-up-button')).toBeTruthy();
    expect(getByTestId('speed-down-button')).toBeTruthy();
  });

  it('calls onSpeedUp when speed up button is pressed', () => {
    const speedState = createSpeedState(5.0);
    const {getByTestId} = render(
      <SpeedIndicator
        speedState={speedState}
        onSpeedUp={mockOnSpeedUp}
        onSpeedDown={mockOnSpeedDown}
      />,
    );

    fireEvent.press(getByTestId('speed-up-button'));

    expect(mockOnSpeedUp).toHaveBeenCalledTimes(1);
  });

  it('calls onSpeedDown when speed down button is pressed', () => {
    const speedState = createSpeedState(5.0);
    const {getByTestId} = render(
      <SpeedIndicator
        speedState={speedState}
        onSpeedUp={mockOnSpeedUp}
        onSpeedDown={mockOnSpeedDown}
      />,
    );

    fireEvent.press(getByTestId('speed-down-button'));

    expect(mockOnSpeedDown).toHaveBeenCalledTimes(1);
  });

  it('disables speed up button when at max speed', () => {
    const speedState = createSpeedState(16.0, 0.5, 16.0);
    const {getByTestId} = render(
      <SpeedIndicator
        speedState={speedState}
        onSpeedUp={mockOnSpeedUp}
        onSpeedDown={mockOnSpeedDown}
      />,
    );

    fireEvent.press(getByTestId('speed-up-button'));

    expect(mockOnSpeedUp).not.toHaveBeenCalled();
  });

  it('disables speed down button when at min speed', () => {
    const speedState = createSpeedState(0.5, 0.5, 16.0);
    const {getByTestId} = render(
      <SpeedIndicator
        speedState={speedState}
        onSpeedUp={mockOnSpeedUp}
        onSpeedDown={mockOnSpeedDown}
      />,
    );

    fireEvent.press(getByTestId('speed-down-button'));

    expect(mockOnSpeedDown).not.toHaveBeenCalled();
  });

  it('disables both buttons when disabled prop is true', () => {
    const speedState = createSpeedState(5.0);
    const {getByTestId} = render(
      <SpeedIndicator
        speedState={speedState}
        onSpeedUp={mockOnSpeedUp}
        onSpeedDown={mockOnSpeedDown}
        disabled
      />,
    );

    fireEvent.press(getByTestId('speed-up-button'));
    fireEvent.press(getByTestId('speed-down-button'));

    expect(mockOnSpeedUp).not.toHaveBeenCalled();
    expect(mockOnSpeedDown).not.toHaveBeenCalled();
  });

  it('shows zero speed correctly', () => {
    const speedState = createSpeedState(0.0, 0.0, 16.0);
    const {getAllByText} = render(
      <SpeedIndicator
        speedState={speedState}
        onSpeedUp={mockOnSpeedUp}
        onSpeedDown={mockOnSpeedDown}
      />,
    );

    // 0.0 appears both as current speed and min range label
    expect(getAllByText('0.0').length).toBeGreaterThanOrEqual(1);
  });
});
