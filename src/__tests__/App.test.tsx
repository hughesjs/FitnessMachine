import React from 'react';
import {render} from '@testing-library/react-native';

// This is a minimal smoke test to verify the app module can be imported
// Full App testing is done in navigation tests which mock the services properly
describe('App', () => {
  // Mock the services to prevent async initialization issues in tests
  jest.mock('../services/ble/BleServiceImpl', () => ({
    BleServiceImpl: jest.fn().mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue(undefined),
      destroy: jest.fn(),
    })),
  }));

  jest.mock('../services/database/SQLiteWorkoutRepository', () => ({
    SQLiteWorkoutRepository: jest.fn().mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue(undefined),
    })),
  }));

  it('module can be imported without crashing', () => {
    // This test verifies the App module doesn't have any import errors
    const AppModule = require('../App');
    expect(AppModule.default).toBeDefined();
  });
});
