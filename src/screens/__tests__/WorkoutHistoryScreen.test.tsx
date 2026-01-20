import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Alert} from 'react-native';
import {WorkoutHistoryScreen} from '../WorkoutHistoryScreen';
import {
  WorkoutHistoryContext,
  WorkoutHistoryContextValue,
} from '../../contexts/WorkoutHistoryContext';
import {CompletedWorkout, createCompletedWorkout} from '../../models';

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('WorkoutHistoryScreen', () => {
  const createMockWorkout = (id: string): CompletedWorkout =>
    createCompletedWorkout({
      workoutId: id,
      distanceInKm: 5.5,
      totalSteps: 8000,
      workoutTimeInSeconds: 3600,
      machineIndicatedCalories: 350,
      calculatedCalories: 400,
      startedAt: new Date('2024-01-15T10:00:00'),
      completedAt: new Date('2024-01-15T11:00:00'),
    });

  const createMockContext = (
    overrides: Partial<WorkoutHistoryContextValue> = {},
  ): WorkoutHistoryContextValue => ({
    workouts: [],
    isLoading: false,
    error: null,
    refresh: jest.fn().mockResolvedValue(undefined),
    deleteWorkout: jest.fn().mockResolvedValue(true),
    deleteAllWorkouts: jest.fn().mockResolvedValue(true),
    addWorkout: jest.fn(),
    ...overrides,
  });

  const renderWithProvider = (
    context: WorkoutHistoryContextValue,
    props: Partial<React.ComponentProps<typeof WorkoutHistoryScreen>> = {},
  ) => {
    return render(
      <WorkoutHistoryContext.Provider value={context}>
        <WorkoutHistoryScreen {...props} />
      </WorkoutHistoryContext.Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading state', () => {
    it('shows loading indicator when loading', () => {
      const context = createMockContext({isLoading: true});
      const {getByTestId} = renderWithProvider(context);

      expect(getByTestId('loading-indicator')).toBeTruthy();
    });

    it('shows loading text when loading', () => {
      const context = createMockContext({isLoading: true});
      const {getByText} = renderWithProvider(context);

      expect(getByText('Loading workouts...')).toBeTruthy();
    });
  });

  describe('Empty state', () => {
    it('shows empty state when no workouts', () => {
      const context = createMockContext({workouts: []});
      const {getByTestId} = renderWithProvider(context);

      expect(getByTestId('empty-history-state')).toBeTruthy();
    });

    it('does not show delete all button when empty', () => {
      const context = createMockContext({workouts: []});
      const {queryByTestId} = renderWithProvider(context);

      expect(queryByTestId('delete-all-button')).toBeNull();
    });
  });

  describe('Workout list', () => {
    it('renders workout list when workouts exist', () => {
      const workouts = [createMockWorkout('workout-1'), createMockWorkout('workout-2')];
      const context = createMockContext({workouts});
      const {getByTestId} = renderWithProvider(context);

      expect(getByTestId('workout-list')).toBeTruthy();
    });

    it('renders all workout items', () => {
      const workouts = [createMockWorkout('workout-1'), createMockWorkout('workout-2')];
      const context = createMockContext({workouts});
      const {getByTestId} = renderWithProvider(context);

      expect(getByTestId('workout-item-workout-1')).toBeTruthy();
      expect(getByTestId('workout-item-workout-2')).toBeTruthy();
    });

    it('shows delete all button when workouts exist', () => {
      const workouts = [createMockWorkout('workout-1')];
      const context = createMockContext({workouts});
      const {getByTestId} = renderWithProvider(context);

      expect(getByTestId('delete-all-button')).toBeTruthy();
    });

    it('calls onWorkoutPress when workout is pressed', () => {
      const workouts = [createMockWorkout('workout-1')];
      const context = createMockContext({workouts});
      const mockOnPress = jest.fn();
      const {getByTestId} = renderWithProvider(context, {
        onWorkoutPress: mockOnPress,
      });

      fireEvent.press(getByTestId('workout-item-workout-1'));

      expect(mockOnPress).toHaveBeenCalledWith(workouts[0]);
    });
  });

  describe('Error state', () => {
    it('shows error message when error exists', () => {
      const context = createMockContext({error: 'Failed to load workouts'});
      const {getByTestId, getByText} = renderWithProvider(context);

      expect(getByTestId('error-message')).toBeTruthy();
      expect(getByText('Failed to load workouts')).toBeTruthy();
    });

    it('shows retry button when error exists', () => {
      const context = createMockContext({error: 'Failed to load'});
      const {getByTestId} = renderWithProvider(context);

      expect(getByTestId('retry-button')).toBeTruthy();
    });

    it('calls refresh when retry button is pressed', () => {
      const mockRefresh = jest.fn().mockResolvedValue(undefined);
      const context = createMockContext({
        error: 'Failed to load',
        refresh: mockRefresh,
      });
      const {getByTestId} = renderWithProvider(context);

      fireEvent.press(getByTestId('retry-button'));

      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  describe('Delete workout', () => {
    it('shows confirmation alert when delete is pressed', () => {
      const workouts = [createMockWorkout('workout-1')];
      const context = createMockContext({workouts});
      const {getByTestId} = renderWithProvider(context);

      fireEvent.press(getByTestId('delete-workout-workout-1'));

      expect(Alert.alert).toHaveBeenCalledWith(
        'Delete Workout',
        'Are you sure you want to delete this workout?',
        expect.any(Array),
      );
    });

    it('calls deleteWorkout when delete is confirmed', async () => {
      const mockDeleteWorkout = jest.fn().mockResolvedValue(true);
      const workouts = [createMockWorkout('workout-1')];
      const context = createMockContext({
        workouts,
        deleteWorkout: mockDeleteWorkout,
      });
      const {getByTestId} = renderWithProvider(context);

      fireEvent.press(getByTestId('delete-workout-workout-1'));

      // Get the alert call and simulate pressing Delete
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const deleteButton = alertCall[2].find(
        (btn: {text: string}) => btn.text === 'Delete',
      );
      deleteButton.onPress();

      expect(mockDeleteWorkout).toHaveBeenCalledWith('workout-1');
    });
  });

  describe('Delete all workouts', () => {
    it('shows confirmation alert when delete all is pressed', () => {
      const workouts = [createMockWorkout('workout-1')];
      const context = createMockContext({workouts});
      const {getByTestId} = renderWithProvider(context);

      fireEvent.press(getByTestId('delete-all-button'));

      expect(Alert.alert).toHaveBeenCalledWith(
        'Delete All Workouts',
        'Are you sure you want to delete all workouts? This cannot be undone.',
        expect.any(Array),
      );
    });

    it('calls deleteAllWorkouts when delete all is confirmed', async () => {
      const mockDeleteAll = jest.fn().mockResolvedValue(true);
      const workouts = [createMockWorkout('workout-1')];
      const context = createMockContext({
        workouts,
        deleteAllWorkouts: mockDeleteAll,
      });
      const {getByTestId} = renderWithProvider(context);

      fireEvent.press(getByTestId('delete-all-button'));

      // Get the alert call and simulate pressing Delete All
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const deleteButton = alertCall[2].find(
        (btn: {text: string}) => btn.text === 'Delete All',
      );
      deleteButton.onPress();

      expect(mockDeleteAll).toHaveBeenCalled();
    });
  });

  describe('Header', () => {
    it('displays title', () => {
      const context = createMockContext();
      const {getByText} = renderWithProvider(context);

      expect(getByText('Workout History')).toBeTruthy();
    });
  });
});
