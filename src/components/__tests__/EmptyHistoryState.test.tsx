import React from 'react';
import {render} from '@testing-library/react-native';
import {EmptyHistoryState} from '../EmptyHistoryState';

describe('EmptyHistoryState', () => {
  it('renders empty state with testID', () => {
    const {getByTestId} = render(<EmptyHistoryState />);

    expect(getByTestId('empty-history-state')).toBeTruthy();
  });

  it('displays default message', () => {
    const {getByText} = render(<EmptyHistoryState />);

    expect(getByText('No workouts yet')).toBeTruthy();
  });

  it('displays custom message when provided', () => {
    const {getByText} = render(<EmptyHistoryState message="No data found" />);

    expect(getByText('No data found')).toBeTruthy();
  });

  it('displays subtitle', () => {
    const {getByText} = render(<EmptyHistoryState />);

    expect(getByText('Complete a workout to see it here')).toBeTruthy();
  });
});
