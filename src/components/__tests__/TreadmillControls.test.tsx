import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {TreadmillControls} from '../TreadmillControls';
import {WorkoutState} from '../../models';

describe('TreadmillControls', () => {
  const mockOnStart = jest.fn();
  const mockOnPause = jest.fn();
  const mockOnResume = jest.fn();
  const mockOnStop = jest.fn();

  beforeEach(() => {
    mockOnStart.mockClear();
    mockOnPause.mockClear();
    mockOnResume.mockClear();
    mockOnStop.mockClear();
  });

  it('renders the controls container', () => {
    const {getByTestId} = render(
      <TreadmillControls
        workoutState={WorkoutState.Idle}
        onStart={mockOnStart}
        onPause={mockOnPause}
        onResume={mockOnResume}
        onStop={mockOnStop}
      />,
    );

    expect(getByTestId('treadmill-controls')).toBeTruthy();
  });

  describe('Idle state', () => {
    it('shows Start button only', () => {
      const {getByTestId, queryByTestId} = render(
        <TreadmillControls
          workoutState={WorkoutState.Idle}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onResume={mockOnResume}
          onStop={mockOnStop}
        />,
      );

      expect(getByTestId('start-button')).toBeTruthy();
      expect(queryByTestId('pause-button')).toBeNull();
      expect(queryByTestId('resume-button')).toBeNull();
      expect(queryByTestId('stop-button')).toBeNull();
    });

    it('calls onStart when Start button is pressed', () => {
      const {getByTestId} = render(
        <TreadmillControls
          workoutState={WorkoutState.Idle}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onResume={mockOnResume}
          onStop={mockOnStop}
        />,
      );

      fireEvent.press(getByTestId('start-button'));

      expect(mockOnStart).toHaveBeenCalledTimes(1);
    });
  });

  describe('Running state', () => {
    it('shows Pause and Stop buttons', () => {
      const {getByTestId, queryByTestId} = render(
        <TreadmillControls
          workoutState={WorkoutState.Running}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onResume={mockOnResume}
          onStop={mockOnStop}
        />,
      );

      expect(queryByTestId('start-button')).toBeNull();
      expect(getByTestId('pause-button')).toBeTruthy();
      expect(queryByTestId('resume-button')).toBeNull();
      expect(getByTestId('stop-button')).toBeTruthy();
    });

    it('calls onPause when Pause button is pressed', () => {
      const {getByTestId} = render(
        <TreadmillControls
          workoutState={WorkoutState.Running}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onResume={mockOnResume}
          onStop={mockOnStop}
        />,
      );

      fireEvent.press(getByTestId('pause-button'));

      expect(mockOnPause).toHaveBeenCalledTimes(1);
    });

    it('calls onStop when Stop button is pressed', () => {
      const {getByTestId} = render(
        <TreadmillControls
          workoutState={WorkoutState.Running}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onResume={mockOnResume}
          onStop={mockOnStop}
        />,
      );

      fireEvent.press(getByTestId('stop-button'));

      expect(mockOnStop).toHaveBeenCalledTimes(1);
    });
  });

  describe('Paused state', () => {
    it('shows Resume and Stop buttons', () => {
      const {getByTestId, queryByTestId} = render(
        <TreadmillControls
          workoutState={WorkoutState.Paused}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onResume={mockOnResume}
          onStop={mockOnStop}
        />,
      );

      expect(queryByTestId('start-button')).toBeNull();
      expect(queryByTestId('pause-button')).toBeNull();
      expect(getByTestId('resume-button')).toBeTruthy();
      expect(getByTestId('stop-button')).toBeTruthy();
    });

    it('calls onResume when Resume button is pressed', () => {
      const {getByTestId} = render(
        <TreadmillControls
          workoutState={WorkoutState.Paused}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onResume={mockOnResume}
          onStop={mockOnStop}
        />,
      );

      fireEvent.press(getByTestId('resume-button'));

      expect(mockOnResume).toHaveBeenCalledTimes(1);
    });

    it('calls onStop when Stop button is pressed in paused state', () => {
      const {getByTestId} = render(
        <TreadmillControls
          workoutState={WorkoutState.Paused}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onResume={mockOnResume}
          onStop={mockOnStop}
        />,
      );

      fireEvent.press(getByTestId('stop-button'));

      expect(mockOnStop).toHaveBeenCalledTimes(1);
    });
  });

  describe('Disabled state', () => {
    it('disables Start button when disabled is true', () => {
      const {getByTestId} = render(
        <TreadmillControls
          workoutState={WorkoutState.Idle}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onResume={mockOnResume}
          onStop={mockOnStop}
          disabled
        />,
      );

      fireEvent.press(getByTestId('start-button'));

      expect(mockOnStart).not.toHaveBeenCalled();
    });

    it('disables Pause and Stop buttons when disabled is true', () => {
      const {getByTestId} = render(
        <TreadmillControls
          workoutState={WorkoutState.Running}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onResume={mockOnResume}
          onStop={mockOnStop}
          disabled
        />,
      );

      fireEvent.press(getByTestId('pause-button'));
      fireEvent.press(getByTestId('stop-button'));

      expect(mockOnPause).not.toHaveBeenCalled();
      expect(mockOnStop).not.toHaveBeenCalled();
    });

    it('disables Resume and Stop buttons when disabled is true', () => {
      const {getByTestId} = render(
        <TreadmillControls
          workoutState={WorkoutState.Paused}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onResume={mockOnResume}
          onStop={mockOnStop}
          disabled
        />,
      );

      fireEvent.press(getByTestId('resume-button'));
      fireEvent.press(getByTestId('stop-button'));

      expect(mockOnResume).not.toHaveBeenCalled();
      expect(mockOnStop).not.toHaveBeenCalled();
    });
  });
});
