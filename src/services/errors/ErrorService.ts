export enum ErrorSeverity {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical',
}

export interface AppError {
  id: string;
  message: string;
  severity: ErrorSeverity;
  timestamp: Date;
  context?: Record<string, any>;
  error?: Error;
}

export type ErrorCallback = (error: AppError) => void;

class ErrorServiceImpl {
  private errors: AppError[] = [];
  private callbacks: Set<ErrorCallback> = new Set();
  private maxErrors = 50;

  logError(
    message: string,
    severity: ErrorSeverity = ErrorSeverity.Medium,
    context?: Record<string, any>,
    error?: Error,
  ): AppError {
    const appError: AppError = {
      id: this.generateId(),
      message,
      severity,
      timestamp: new Date(),
      context,
      error,
    };

    this.errors.unshift(appError);

    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    console.error(`[${severity.toUpperCase()}] ${message}`, {
      context,
      error,
    });

    this.callbacks.forEach(cb => cb(appError));

    return appError;
  }

  getErrors(): AppError[] {
    return [...this.errors];
  }

  getErrorsBySeverity(severity: ErrorSeverity): AppError[] {
    return this.errors.filter(e => e.severity === severity);
  }

  clearErrors(): void {
    this.errors = [];
  }

  onError(callback: ErrorCallback): () => void {
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
}

export const ErrorService = new ErrorServiceImpl();
