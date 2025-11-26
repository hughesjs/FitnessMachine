import {ErrorService, ErrorSeverity} from '../ErrorService';

describe('ErrorService', () => {
  beforeEach(() => {
    ErrorService.clearErrors();
  });

  describe('logError', () => {
    it('creates and stores an error', () => {
      const error = ErrorService.logError(
        'Test error',
        ErrorSeverity.Medium,
        {foo: 'bar'},
      );

      expect(error.message).toBe('Test error');
      expect(error.severity).toBe(ErrorSeverity.Medium);
      expect(error.context).toEqual({foo: 'bar'});
      expect(error.id).toBeTruthy();
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('defaults to Medium severity', () => {
      const error = ErrorService.logError('Test error');

      expect(error.severity).toBe(ErrorSeverity.Medium);
    });

    it('stores error in the errors list', () => {
      ErrorService.logError('Error 1', ErrorSeverity.Low);
      ErrorService.logError('Error 2', ErrorSeverity.High);

      const errors = ErrorService.getErrors();
      expect(errors).toHaveLength(2);
      expect(errors[0].message).toBe('Error 2');
      expect(errors[1].message).toBe('Error 1');
    });

    it('includes Error object when provided', () => {
      const originalError = new Error('Original error');
      const error = ErrorService.logError(
        'Wrapped error',
        ErrorSeverity.Critical,
        {},
        originalError,
      );

      expect(error.error).toBe(originalError);
    });

    it('limits stored errors to 50', () => {
      for (let i = 0; i < 60; i++) {
        ErrorService.logError(`Error ${i}`, ErrorSeverity.Low);
      }

      const errors = ErrorService.getErrors();
      expect(errors).toHaveLength(50);
      expect(errors[0].message).toBe('Error 59');
      expect(errors[49].message).toBe('Error 10');
    });

    it('notifies registered callbacks', () => {
      const callback = jest.fn();
      ErrorService.onError(callback);

      const error = ErrorService.logError('Test error', ErrorSeverity.High);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(error);
    });

    it('generates unique IDs for each error', () => {
      const error1 = ErrorService.logError('Error 1');
      const error2 = ErrorService.logError('Error 2');

      expect(error1.id).not.toBe(error2.id);
    });
  });

  describe('getErrors', () => {
    it('returns empty array when no errors', () => {
      const errors = ErrorService.getErrors();
      expect(errors).toEqual([]);
    });

    it('returns all stored errors', () => {
      ErrorService.logError('Error 1', ErrorSeverity.Low);
      ErrorService.logError('Error 2', ErrorSeverity.High);
      ErrorService.logError('Error 3', ErrorSeverity.Critical);

      const errors = ErrorService.getErrors();
      expect(errors).toHaveLength(3);
    });

    it('returns a copy of errors array', () => {
      ErrorService.logError('Error 1');
      const errors1 = ErrorService.getErrors();
      const errors2 = ErrorService.getErrors();

      expect(errors1).not.toBe(errors2);
      expect(errors1).toEqual(errors2);
    });
  });

  describe('getErrorsBySeverity', () => {
    beforeEach(() => {
      ErrorService.logError('Low 1', ErrorSeverity.Low);
      ErrorService.logError('Medium 1', ErrorSeverity.Medium);
      ErrorService.logError('High 1', ErrorSeverity.High);
      ErrorService.logError('Critical 1', ErrorSeverity.Critical);
      ErrorService.logError('Low 2', ErrorSeverity.Low);
      ErrorService.logError('High 2', ErrorSeverity.High);
    });

    it('filters errors by severity', () => {
      const lowErrors = ErrorService.getErrorsBySeverity(ErrorSeverity.Low);
      const highErrors = ErrorService.getErrorsBySeverity(ErrorSeverity.High);

      expect(lowErrors).toHaveLength(2);
      expect(highErrors).toHaveLength(2);
      expect(lowErrors[0].message).toBe('Low 2');
      expect(lowErrors[1].message).toBe('Low 1');
    });

    it('returns empty array when no errors match severity', () => {
      ErrorService.clearErrors();
      ErrorService.logError('Low', ErrorSeverity.Low);

      const criticalErrors = ErrorService.getErrorsBySeverity(ErrorSeverity.Critical);
      expect(criticalErrors).toEqual([]);
    });
  });

  describe('clearErrors', () => {
    it('removes all errors', () => {
      ErrorService.logError('Error 1', ErrorSeverity.Low);
      ErrorService.logError('Error 2', ErrorSeverity.High);

      ErrorService.clearErrors();

      const errors = ErrorService.getErrors();
      expect(errors).toEqual([]);
    });
  });

  describe('onError', () => {
    it('registers callback that is called when error occurs', () => {
      const callback = jest.fn();
      ErrorService.onError(callback);

      ErrorService.logError('Test error', ErrorSeverity.Medium);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('supports multiple callbacks', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      ErrorService.onError(callback1);
      ErrorService.onError(callback2);

      ErrorService.logError('Test error', ErrorSeverity.Medium);

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('returns unsubscribe function that removes callback', () => {
      const callback = jest.fn();
      const unsubscribe = ErrorService.onError(callback);

      ErrorService.logError('Error 1', ErrorSeverity.Low);
      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();

      ErrorService.logError('Error 2', ErrorSeverity.Low);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});
