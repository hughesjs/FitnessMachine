import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {ErrorService, AppError, ErrorSeverity} from '../services/errors';

interface ErrorContextState {
  errors: AppError[];
  lastError: AppError | null;
  hasErrors: boolean;
}

interface ErrorContextActions {
  logError: (
    message: string,
    severity?: ErrorSeverity,
    context?: Record<string, any>,
    error?: Error,
  ) => void;
  clearErrors: () => void;
  dismissError: (errorId: string) => void;
}

export type ErrorContextValue = ErrorContextState & ErrorContextActions;

export const ErrorContext = createContext<ErrorContextValue | null>(null);

interface ErrorProviderProps {
  children: ReactNode;
}

export function ErrorProvider({children}: ErrorProviderProps): React.JSX.Element {
  const [errors, setErrors] = useState<AppError[]>([]);

  useEffect(() => {
    const unsubscribe = ErrorService.onError(error => {
      setErrors(ErrorService.getErrors());
    });

    return unsubscribe;
  }, []);

  const logError = useCallback(
    (
      message: string,
      severity: ErrorSeverity = ErrorSeverity.Medium,
      context?: Record<string, any>,
      error?: Error,
    ) => {
      ErrorService.logError(message, severity, context, error);
    },
    [],
  );

  const clearErrors = useCallback(() => {
    ErrorService.clearErrors();
    setErrors([]);
  }, []);

  const dismissError = useCallback((errorId: string) => {
    setErrors(prev => prev.filter(e => e.id !== errorId));
  }, []);

  const value: ErrorContextValue = {
    errors,
    lastError: errors[0] ?? null,
    hasErrors: errors.length > 0,
    logError,
    clearErrors,
    dismissError,
  };

  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
}

export function useErrors(): ErrorContextValue {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrors must be used within an ErrorProvider');
  }
  return context;
}
