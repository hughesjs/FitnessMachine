import React from 'react';
import {renderHook, act} from '@testing-library/react-native';
import {ErrorProvider, useErrors} from '../ErrorContext';
import {ErrorService, ErrorSeverity} from '../../services/errors';

describe('ErrorContext', () => {
  beforeEach(() => {
    ErrorService.clearErrors();
  });

  const wrapper = ({children}: {children: React.ReactNode}) => (
    <ErrorProvider>{children}</ErrorProvider>
  );

  it('throws error when useErrors is used outside ErrorProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useErrors());
    }).toThrow('useErrors must be used within an ErrorProvider');

    consoleError.mockRestore();
  });

  it('initializes with empty error state', () => {
    const {result} = renderHook(() => useErrors(), {wrapper});

    expect(result.current.errors).toEqual([]);
    expect(result.current.lastError).toBeNull();
    expect(result.current.hasErrors).toBe(false);
  });

  it('updates state when ErrorService logs an error', () => {
    const {result} = renderHook(() => useErrors(), {wrapper});

    act(() => {
      ErrorService.logError('Test error', ErrorSeverity.High);
    });

    expect(result.current.errors).toHaveLength(1);
    expect(result.current.errors[0]!.message).toBe('Test error');
    expect(result.current.errors[0]!.severity).toBe(ErrorSeverity.High);
    expect(result.current.lastError).toBe(result.current.errors[0]);
    expect(result.current.hasErrors).toBe(true);
  });

  it('logError creates error through ErrorService', () => {
    const {result} = renderHook(() => useErrors(), {wrapper});

    act(() => {
      result.current.logError('Context error', ErrorSeverity.Critical, {
        source: 'test',
      });
    });

    expect(result.current.errors).toHaveLength(1);
    expect(result.current.errors[0]!.message).toBe('Context error');
    expect(result.current.errors[0]!.severity).toBe(ErrorSeverity.Critical);
    expect(result.current.errors[0]!.context).toEqual({source: 'test'});
  });

  it('logError defaults to Medium severity', () => {
    const {result} = renderHook(() => useErrors(), {wrapper});

    act(() => {
      result.current.logError('Default severity error');
    });

    expect(result.current.errors[0]!.severity).toBe(ErrorSeverity.Medium);
  });

  it('logError can include Error object', () => {
    const {result} = renderHook(() => useErrors(), {wrapper});
    const originalError = new Error('Original error');

    act(() => {
      result.current.logError(
        'Wrapped error',
        ErrorSeverity.High,
        {},
        originalError,
      );
    });

    expect(result.current.errors[0]!.error).toBe(originalError);
  });

  it('clearErrors removes all errors', () => {
    const {result} = renderHook(() => useErrors(), {wrapper});

    act(() => {
      result.current.logError('Error 1', ErrorSeverity.Low);
      result.current.logError('Error 2', ErrorSeverity.High);
    });

    expect(result.current.errors).toHaveLength(2);

    act(() => {
      result.current.clearErrors();
    });

    expect(result.current.errors).toEqual([]);
    expect(result.current.lastError).toBeNull();
    expect(result.current.hasErrors).toBe(false);
  });

  it('dismissError removes specific error', () => {
    const {result} = renderHook(() => useErrors(), {wrapper});

    act(() => {
      result.current.logError('Error 1', ErrorSeverity.Low);
      result.current.logError('Error 2', ErrorSeverity.High);
      result.current.logError('Error 3', ErrorSeverity.Critical);
    });

    const errorIdToRemove = result.current.errors[1]!.id;

    act(() => {
      result.current.dismissError(errorIdToRemove);
    });

    expect(result.current.errors).toHaveLength(2);
    expect(result.current.errors.find(e => e.id === errorIdToRemove)).toBeUndefined();
  });

  it('lastError returns most recent error', () => {
    const {result} = renderHook(() => useErrors(), {wrapper});

    act(() => {
      result.current.logError('Error 1', ErrorSeverity.Low);
    });

    const firstError = result.current.lastError;
    expect(firstError?.message).toBe('Error 1');

    act(() => {
      result.current.logError('Error 2', ErrorSeverity.High);
    });

    expect(result.current.lastError?.message).toBe('Error 2');
    expect(result.current.lastError).not.toBe(firstError);
  });

  it('tracks multiple errors in order', () => {
    const {result} = renderHook(() => useErrors(), {wrapper});

    act(() => {
      result.current.logError('First', ErrorSeverity.Low);
      result.current.logError('Second', ErrorSeverity.Medium);
      result.current.logError('Third', ErrorSeverity.High);
    });

    expect(result.current.errors).toHaveLength(3);
    expect(result.current.errors[0]!.message).toBe('Third');
    expect(result.current.errors[1]!.message).toBe('Second');
    expect(result.current.errors[2]!.message).toBe('First');
  });

  it('hasErrors reflects error state correctly', () => {
    const {result} = renderHook(() => useErrors(), {wrapper});

    expect(result.current.hasErrors).toBe(false);

    act(() => {
      result.current.logError('Error', ErrorSeverity.Low);
    });

    expect(result.current.hasErrors).toBe(true);

    act(() => {
      result.current.clearErrors();
    });

    expect(result.current.hasErrors).toBe(false);
  });

  it('dismissError updates lastError when last error is dismissed', () => {
    const {result} = renderHook(() => useErrors(), {wrapper});

    act(() => {
      result.current.logError('Error 1', ErrorSeverity.Low);
      result.current.logError('Error 2', ErrorSeverity.High);
    });

    const lastErrorId = result.current.lastError!.id;

    act(() => {
      result.current.dismissError(lastErrorId);
    });

    expect(result.current.lastError?.message).toBe('Error 1');
  });

  it('dismissError sets lastError to null when all errors dismissed', () => {
    const {result} = renderHook(() => useErrors(), {wrapper});

    act(() => {
      result.current.logError('Only error', ErrorSeverity.Low);
    });

    const errorId = result.current.errors[0]!.id;

    act(() => {
      result.current.dismissError(errorId);
    });

    expect(result.current.lastError).toBeNull();
    expect(result.current.hasErrors).toBe(false);
  });
});
