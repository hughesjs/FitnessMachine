import React, {useState} from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Text, TouchableOpacity} from 'react-native';
import {ErrorBoundary} from '../ErrorBoundary';
import {ErrorService, ErrorSeverity} from '../../services/errors';

const ThrowingComponent = ({shouldThrow}: {shouldThrow: boolean}) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <Text>Normal content</Text>;
};

const ToggleableThrowingComponent = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  return (
    <>
      <TouchableOpacity
        testID="trigger-error"
        onPress={() => setShouldThrow(true)}>
        <Text>Trigger Error</Text>
      </TouchableOpacity>
      <ThrowingComponent shouldThrow={shouldThrow} />
    </>
  );
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    ErrorService.clearErrors();
    jest.spyOn(ErrorService, 'logError');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children when no error occurs', () => {
    const {getByText} = render(
      <ErrorBoundary>
        <Text>Test content</Text>
      </ErrorBoundary>,
    );

    expect(getByText('Test content')).toBeTruthy();
  });

  it('renders default fallback UI when error occurs', () => {
    const {getByText} = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(getByText('Something went wrong')).toBeTruthy();
    expect(
      getByText('An unexpected error occurred. Please try again.'),
    ).toBeTruthy();
  });

  it('logs error to ErrorService when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(ErrorService.logError).toHaveBeenCalledWith(
      'React component error',
      ErrorSeverity.Critical,
      expect.objectContaining({
        componentStack: expect.any(String),
      }),
      expect.any(Error),
    );
  });

  it('shows error message in development mode', () => {
    const originalDev = (global as any).__DEV__;
    (global as any).__DEV__ = true;

    const {getByText} = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(getByText('Test error')).toBeTruthy();

    (global as any).__DEV__ = originalDev;
  });

  it('hides error message in production mode', () => {
    const originalDev = (global as any).__DEV__;
    (global as any).__DEV__ = false;

    const {queryByText} = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(queryByText('Test error')).toBeNull();

    (global as any).__DEV__ = originalDev;
  });

  it('resets error when Try Again button is pressed', () => {
    const {getByText, getByTestId} = render(
      <ErrorBoundary>
        <ToggleableThrowingComponent />
      </ErrorBoundary>,
    );

    fireEvent.press(getByTestId('trigger-error'));

    expect(getByText('Something went wrong')).toBeTruthy();

    fireEvent.press(getByTestId('error-boundary-reset'));

    expect(getByText('Normal content')).toBeTruthy();
    expect(getByText('Trigger Error')).toBeTruthy();
  });

  it('uses custom fallback when provided', () => {
    const customFallback = (error: Error, resetError: () => void) => (
      <>
        <Text>Custom error: {error.message}</Text>
        <Text onPress={resetError}>Custom reset</Text>
      </>
    );

    const {getByText, queryByText} = render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(getByText('Custom error: Test error')).toBeTruthy();
    expect(getByText('Custom reset')).toBeTruthy();
    expect(queryByText('Something went wrong')).toBeNull();
  });

  it('custom fallback resetError works', () => {
    const customFallback = (error: Error, resetError: () => void) => (
      <Text onPress={resetError}>Reset</Text>
    );

    const {getByText} = render(
      <ErrorBoundary fallback={customFallback}>
        <ToggleableThrowingComponent />
      </ErrorBoundary>,
    );

    fireEvent.press(getByText('Trigger Error'));

    expect(getByText('Reset')).toBeTruthy();

    fireEvent.press(getByText('Reset'));

    expect(getByText('Normal content')).toBeTruthy();
  });

  it('does not interfere with nested error boundaries', () => {
    const InnerBoundary = () => (
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const {getByText} = render(
      <ErrorBoundary>
        <InnerBoundary />
        <Text>Outer content</Text>
      </ErrorBoundary>,
    );

    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText('Outer content')).toBeTruthy();
  });
});
