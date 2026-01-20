import React from 'react';
import {render} from '@testing-library/react-native';
import {ScanningIndicator} from '../ScanningIndicator';

describe('ScanningIndicator', () => {
  it('renders when scanning', () => {
    const {getByTestId, getByText} = render(
      <ScanningIndicator isScanning={true} />,
    );

    expect(getByTestId('scanning-indicator')).toBeTruthy();
    expect(getByText('Scanning for devices...')).toBeTruthy();
  });

  it('does not render when not scanning', () => {
    const {queryByTestId} = render(<ScanningIndicator isScanning={false} />);

    expect(queryByTestId('scanning-indicator')).toBeNull();
  });
});
