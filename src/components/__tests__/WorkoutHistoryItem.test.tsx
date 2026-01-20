import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {WorkoutHistoryItem} from '../WorkoutHistoryItem';
import {CompletedWorkout, createCompletedWorkout} from '../../models';

describe('WorkoutHistoryItem', () => {
  const createMockWorkout = (
    overrides: Partial<CompletedWorkout> = {},
  ): CompletedWorkout =>
    createCompletedWorkout({
      workoutId: 'workout-123',
      distanceInKm: 5.5,
      totalSteps: 8000,
      workoutTimeInSeconds: 3600, // 1 hour
      machineIndicatedCalories: 350,
      calculatedCalories: 400,
      startedAt: new Date('2024-01-15T10:00:00'),
      completedAt: new Date('2024-01-15T11:00:00'),
      ...overrides,
    });

  const mockOnPress = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
    mockOnDelete.mockClear();
  });

  it('renders workout item with testID', () => {
    const workout = createMockWorkout();
    const {getByTestId} = render(<WorkoutHistoryItem workout={workout} />);

    expect(getByTestId('workout-item-workout-123')).toBeTruthy();
  });

  it('displays distance correctly', () => {
    const workout = createMockWorkout({distanceInKm: 5.5});
    const {getByText} = render(<WorkoutHistoryItem workout={workout} />);

    expect(getByText('5.50')).toBeTruthy();
    expect(getByText('km')).toBeTruthy();
  });

  it('displays duration correctly', () => {
    const workout = createMockWorkout({workoutTimeInSeconds: 3600}); // 1 hour
    const {getByText} = render(<WorkoutHistoryItem workout={workout} />);

    expect(getByText('1h 0m')).toBeTruthy();
  });

  it('displays steps with locale formatting', () => {
    const workout = createMockWorkout({totalSteps: 8000});
    const {getByText} = render(<WorkoutHistoryItem workout={workout} />);

    expect(getByText('8,000')).toBeTruthy();
    expect(getByText('steps')).toBeTruthy();
  });

  it('displays calculated calories', () => {
    const workout = createMockWorkout({calculatedCalories: 400});
    const {getByText} = render(<WorkoutHistoryItem workout={workout} />);

    expect(getByText('400')).toBeTruthy();
    expect(getByText('kcal')).toBeTruthy();
  });

  it('calls onPress when item is pressed', () => {
    const workout = createMockWorkout();
    const {getByTestId} = render(
      <WorkoutHistoryItem workout={workout} onPress={mockOnPress} />,
    );

    fireEvent.press(getByTestId('workout-item-workout-123'));

    expect(mockOnPress).toHaveBeenCalledWith(workout);
  });

  it('shows delete button when onDelete is provided', () => {
    const workout = createMockWorkout();
    const {getByTestId} = render(
      <WorkoutHistoryItem workout={workout} onDelete={mockOnDelete} />,
    );

    expect(getByTestId('delete-workout-workout-123')).toBeTruthy();
  });

  it('does not show delete button when onDelete is not provided', () => {
    const workout = createMockWorkout();
    const {queryByTestId} = render(<WorkoutHistoryItem workout={workout} />);

    expect(queryByTestId('delete-workout-workout-123')).toBeNull();
  });

  it('calls onDelete when delete button is pressed', () => {
    const workout = createMockWorkout();
    const {getByTestId} = render(
      <WorkoutHistoryItem workout={workout} onDelete={mockOnDelete} />,
    );

    fireEvent.press(getByTestId('delete-workout-workout-123'));

    expect(mockOnDelete).toHaveBeenCalledWith(workout);
  });

  it('displays short duration correctly', () => {
    const workout = createMockWorkout({workoutTimeInSeconds: 125}); // 2m 5s
    const {getByText} = render(<WorkoutHistoryItem workout={workout} />);

    expect(getByText('2m 5s')).toBeTruthy();
  });

  it('displays very short duration correctly', () => {
    const workout = createMockWorkout({workoutTimeInSeconds: 45});
    const {getByText} = render(<WorkoutHistoryItem workout={workout} />);

    expect(getByText('45s')).toBeTruthy();
  });
});
