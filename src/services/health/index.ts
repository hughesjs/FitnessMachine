// Health service exports

export {
  HealthPlatform,
  HealthAuthStatus,
  HealthDataType,
  HealthWorkoutType,
  type HealthOperationResult,
  type HealthWorkoutData,
  createHealthWorkoutData,
  getHealthPlatformName,
  getAuthStatusMessage,
} from './HealthTypes';

export {
  type HealthService,
  healthSuccess,
  healthError,
} from './HealthService';

export {MockHealthService} from './MockHealthService';
