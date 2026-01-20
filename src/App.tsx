import React, {useEffect, useState, useMemo} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootNavigator} from './navigation';
import {BleProvider} from './contexts/BleContext';
import {WorkoutProvider} from './contexts/WorkoutContext';
import {WorkoutHistoryProvider} from './contexts/WorkoutHistoryContext';
import {ErrorProvider} from './contexts/ErrorContext';
import {ErrorBoundary} from './components/ErrorBoundary';
import {BleServiceImpl} from './services/ble';
import {SQLiteWorkoutRepository} from './services/database';
import {ErrorService, ErrorSeverity} from './services/errors';

function AppContent(): React.JSX.Element {
  const bleService = useMemo(() => new BleServiceImpl(), []);
  const workoutRepository = useMemo(() => new SQLiteWorkoutRepository(), []);

  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    async function initialize() {
      try {
        await bleService.initialize();
        await workoutRepository.initialize();
        setIsInitializing(false);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize';
        ErrorService.logError(
          'App initialization failed',
          ErrorSeverity.Critical,
          {phase: 'startup'},
          error instanceof Error ? error : undefined,
        );
        setInitError(errorMessage);
        setIsInitializing(false);
      }
    }

    initialize();

    return () => {
      bleService.destroy();
      workoutRepository.close().catch(err =>
        console.error('Failed to close database:', err)
      );
    };
  }, [bleService, workoutRepository]);

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer} testID="app-loading">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    );
  }

  if (initError) {
    return (
      <View style={styles.errorContainer} testID="app-error">
        <Text style={styles.errorTitle}>Initialization Failed</Text>
        <Text style={styles.errorText}>{initError}</Text>
      </View>
    );
  }

  return (
    <BleProvider bleService={bleService}>
      <WorkoutProvider workoutRepository={workoutRepository}>
        <WorkoutHistoryProvider workoutRepository={workoutRepository}>
          <RootNavigator />
        </WorkoutHistoryProvider>
      </WorkoutProvider>
    </BleProvider>
  );
}

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <ErrorProvider>
        <NavigationContainer>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </NavigationContainer>
      </ErrorProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default App;
