import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {WorkoutState} from '../models';

interface TreadmillControlsProps {
  workoutState: WorkoutState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export function TreadmillControls({
  workoutState,
  onStart,
  onPause,
  onResume,
  onStop,
  disabled = false,
}: TreadmillControlsProps): React.JSX.Element {
  const isIdle = workoutState === WorkoutState.Idle;
  const isRunning = workoutState === WorkoutState.Running;
  const isPaused = workoutState === WorkoutState.Paused;

  return (
    <View style={styles.container} testID="treadmill-controls">
      {isIdle && (
        <TouchableOpacity
          style={[styles.startButton, disabled && styles.buttonDisabled]}
          onPress={onStart}
          disabled={disabled}
          testID="start-button">
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      )}

      {isRunning && (
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.pauseButton, disabled && styles.buttonDisabled]}
            onPress={onPause}
            disabled={disabled}
            testID="pause-button">
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.stopButton, disabled && styles.buttonDisabled]}
            onPress={onStop}
            disabled={disabled}
            testID="stop-button">
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      )}

      {isPaused && (
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.resumeButton, disabled && styles.buttonDisabled]}
            onPress={onResume}
            disabled={disabled}
            testID="resume-button">
            <Text style={styles.buttonText}>Resume</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.stopButton, disabled && styles.buttonDisabled]}
            onPress={onStop}
            disabled={disabled}
            testID="stop-button">
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  startButton: {
    backgroundColor: '#34C759',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  pauseButton: {
    flex: 1,
    backgroundColor: '#FF9500',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  resumeButton: {
    flex: 1,
    backgroundColor: '#34C759',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  stopButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
