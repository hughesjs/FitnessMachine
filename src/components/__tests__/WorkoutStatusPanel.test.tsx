import React from 'react';
import {render} from '@testing-library/react-native';
import {WorkoutStatusPanel} from '../WorkoutStatusPanel';
import {TreadmillData, createEmptyTreadmillData} from '../../models';

describe('WorkoutStatusPanel', () => {
  it('renders all four metric cards', () => {
    const data = createEmptyTreadmillData();
    const {getByTestId} = render(<WorkoutStatusPanel data={data} />);

    expect(getByTestId('workout-status-panel')).toBeTruthy();
    expect(getByTestId('metric-distance')).toBeTruthy();
    expect(getByTestId('metric-time')).toBeTruthy();
    expect(getByTestId('metric-steps')).toBeTruthy();
    expect(getByTestId('metric-calories')).toBeTruthy();
  });

  it('displays distance correctly', () => {
    const data: TreadmillData = {
      ...createEmptyTreadmillData(),
      distanceInKm: 2.5,
    };
    const {getByText} = render(<WorkoutStatusPanel data={data} />);

    expect(getByText('2.50')).toBeTruthy();
    expect(getByText('km')).toBeTruthy();
  });

  it('displays time correctly', () => {
    const data: TreadmillData = {
      ...createEmptyTreadmillData(),
      timeInSeconds: 3661, // 1:01:01
    };
    const {getByText} = render(<WorkoutStatusPanel data={data} />);

    expect(getByText('1:01:01')).toBeTruthy();
  });

  it('displays steps correctly', () => {
    const data: TreadmillData = {
      ...createEmptyTreadmillData(),
      steps: 5432,
    };
    const {getByText} = render(<WorkoutStatusPanel data={data} />);

    expect(getByText('5,432')).toBeTruthy();
  });

  it('displays calories correctly', () => {
    const data: TreadmillData = {
      ...createEmptyTreadmillData(),
      indicatedKiloCalories: 150,
    };
    const {getByText} = render(<WorkoutStatusPanel data={data} />);

    expect(getByText('150')).toBeTruthy();
    expect(getByText('kcal')).toBeTruthy();
  });

  it('displays zero values correctly', () => {
    const data = createEmptyTreadmillData();
    const {getByText, getAllByText} = render(<WorkoutStatusPanel data={data} />);

    expect(getByText('0.00')).toBeTruthy();
    expect(getByText('0:00')).toBeTruthy();
    // Multiple zeros appear (steps: 0 and calories: 0)
    expect(getAllByText('0').length).toBeGreaterThanOrEqual(1);
  });

  it('formats large numbers with locale string', () => {
    const data: TreadmillData = {
      ...createEmptyTreadmillData(),
      steps: 10500,
    };
    const {getByText} = render(<WorkoutStatusPanel data={data} />);

    expect(getByText('10,500')).toBeTruthy();
  });
});
