import React, {useCallback, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {useBle} from '../contexts/BleContext';
import {useWorkout} from '../contexts/WorkoutContext';
import {createSpeedState, clampSpeed, roundToIncrement} from '../models';
import {
  WorkoutStatusPanel,
  SpeedIndicator,
  TreadmillControls,
} from '../components';
import {ErrorService, ErrorSeverity} from '../services/errors';

interface ControlScreenProps {
  onDisconnect?: () => void;
  onSelectDevice?: () => void;
}

export function ControlScreen({
  onDisconnect,
  onSelectDevice,
}: ControlScreenProps): React.JSX.Element {
  const {
    isConnected,
    connectedDevice,
    treadmillData,
    speedRange,
    requestControl,
    startWorkout: bleStartWorkout,
    stopWorkout: bleStopWorkout,
    pauseWorkout: blePauseWorkout,
    setTargetSpeed,
    disconnect,
    error,
  } = useBle();

  const {
    workoutState,
    canStart,
    canPause,
    canResume,
    canStop,
    startWorkout: localStartWorkout,
    pauseWorkout: localPauseWorkout,
    resumeWorkout: localResumeWorkout,
    stopWorkout: localStopWorkout,
  } = useWorkout();

  const speedOperationInProgress = useRef(false);
  const speedState = createSpeedState(treadmillData.speedInKmh, speedRange);

  const handleStart = useCallback(async () => {
    try {
      await requestControl();
      const success = await bleStartWorkout();
      if (success) {
        localStartWorkout();
      }
    } catch (err) {
      console.error('Failed to start workout:', err);
      ErrorService.logError(
        'Failed to start workout',
        ErrorSeverity.High,
        {action: 'handleStart'},
        err instanceof Error ? err : undefined,
      );
    }
  }, [requestControl, bleStartWorkout, localStartWorkout]);

  const handlePause = useCallback(async () => {
    try {
      const success = await blePauseWorkout();
      if (success) {
        localPauseWorkout();
      }
    } catch (err) {
      console.error('Failed to pause workout:', err);
      ErrorService.logError(
        'Failed to pause workout',
        ErrorSeverity.High,
        {action: 'handlePause'},
        err instanceof Error ? err : undefined,
      );
    }
  }, [blePauseWorkout, localPauseWorkout]);

  const handleResume = useCallback(async () => {
    try {
      const success = await bleStartWorkout();
      if (success) {
        localResumeWorkout();
      }
    } catch (err) {
      console.error('Failed to resume workout:', err);
      ErrorService.logError(
        'Failed to resume workout',
        ErrorSeverity.High,
        {action: 'handleResume'},
        err instanceof Error ? err : undefined,
      );
    }
  }, [bleStartWorkout, localResumeWorkout]);

  const handleStop = useCallback(async () => {
    try {
      const success = await bleStopWorkout();
      if (success) {
        await localStopWorkout(treadmillData);
      }
    } catch (err) {
      console.error('Failed to stop workout:', err);
      ErrorService.logError(
        'Failed to stop workout',
        ErrorSeverity.High,
        {action: 'handleStop'},
        err instanceof Error ? err : undefined,
      );
    }
  }, [bleStopWorkout, localStopWorkout, treadmillData]);

  const handleSpeedUp = useCallback(async () => {
    if (speedOperationInProgress.current) {
      return;
    }
    try {
      speedOperationInProgress.current = true;
      const newSpeed = roundToIncrement(
        treadmillData.speedInKmh + speedRange.minIncrementInKmh,
        speedRange,
      );
      const clampedSpeed = clampSpeed(newSpeed, speedRange);
      await setTargetSpeed(clampedSpeed);
    } catch (err) {
      console.error('Failed to increase speed:', err);
      ErrorService.logError(
        'Failed to increase speed',
        ErrorSeverity.Medium,
        {action: 'handleSpeedUp'},
        err instanceof Error ? err : undefined,
      );
    } finally {
      speedOperationInProgress.current = false;
    }
  }, [treadmillData.speedInKmh, speedRange, setTargetSpeed]);

  const handleSpeedDown = useCallback(async () => {
    if (speedOperationInProgress.current) {
      return;
    }
    try {
      speedOperationInProgress.current = true;
      const newSpeed = roundToIncrement(
        treadmillData.speedInKmh - speedRange.minIncrementInKmh,
        speedRange,
      );
      const clampedSpeed = clampSpeed(newSpeed, speedRange);
      await setTargetSpeed(clampedSpeed);
    } catch (err) {
      console.error('Failed to decrease speed:', err);
      ErrorService.logError(
        'Failed to decrease speed',
        ErrorSeverity.Medium,
        {action: 'handleSpeedDown'},
        err instanceof Error ? err : undefined,
      );
    } finally {
      speedOperationInProgress.current = false;
    }
  }, [treadmillData.speedInKmh, speedRange, setTargetSpeed]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      onDisconnect?.();
    } catch (err) {
      console.error('Failed to disconnect:', err);
      ErrorService.logError(
        'Failed to disconnect',
        ErrorSeverity.Medium,
        {action: 'handleDisconnect'},
        err instanceof Error ? err : undefined,
      );
    }
  }, [disconnect, onDisconnect]);

  // Not connected state
  if (!isConnected) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notConnectedContainer}>
          <Text style={styles.notConnectedTitle}>No Device Connected</Text>
          <Text style={styles.notConnectedSubtitle}>
            Connect to a fitness machine to start your workout
          </Text>
          <TouchableOpacity
            style={styles.connectButton}
            onPress={onSelectDevice}
            testID="connect-button">
            <Text style={styles.connectButtonText}>Connect Device</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.deviceName}>
            {connectedDevice?.device.name ?? 'Connected Device'}
          </Text>
          <Text style={styles.deviceStatus}>Connected</Text>
        </View>
        <TouchableOpacity
          onPress={handleDisconnect}
          testID="disconnect-button">
          <Text style={styles.disconnectButton}>Disconnect</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer} testID="error-message">
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView style={styles.content}>
        <WorkoutStatusPanel data={treadmillData} />

        <View style={styles.separator} />

        <SpeedIndicator
          speedState={speedState}
          onSpeedUp={handleSpeedUp}
          onSpeedDown={handleSpeedDown}
          disabled={!canPause && !canResume}
        />

        <View style={styles.separator} />

        <TreadmillControls
          workoutState={workoutState}
          onStart={handleStart}
          onPause={handlePause}
          onResume={handleResume}
          onStop={handleStop}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  deviceStatus: {
    fontSize: 14,
    color: '#34C759',
    marginTop: 2,
  },
  disconnectButton: {
    fontSize: 16,
    color: '#FF3B30',
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderBottomWidth: 1,
    borderBottomColor: '#FFCDD2',
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  separator: {
    height: 8,
    backgroundColor: '#f5f5f5',
  },
  notConnectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  notConnectedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  notConnectedSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  connectButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
