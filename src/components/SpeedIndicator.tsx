import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {SpeedState, getSpeedPercentage, canIncreaseSpeed, canDecreaseSpeed} from '../models';

interface SpeedIndicatorProps {
  speedState: SpeedState;
  onSpeedUp: () => void;
  onSpeedDown: () => void;
  disabled?: boolean;
}

export function SpeedIndicator({
  speedState,
  onSpeedUp,
  onSpeedDown,
  disabled = false,
}: SpeedIndicatorProps): React.JSX.Element {
  const percentage = getSpeedPercentage(speedState);
  const canIncrease = canIncreaseSpeed(speedState) && !disabled;
  const canDecrease = canDecreaseSpeed(speedState) && !disabled;

  return (
    <View style={styles.container} testID="speed-indicator">
      <View style={styles.speedDisplay}>
        <Text style={styles.speedValue}>
          {speedState.speedInKmh.toFixed(1)}
        </Text>
        <Text style={styles.speedUnit}>km/h</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[styles.progressFill, {width: `${percentage * 100}%`}]}
          />
        </View>
        <View style={styles.rangeLabels}>
          <Text style={styles.rangeLabel}>
            {speedState.minSpeed.toFixed(1)}
          </Text>
          <Text style={styles.rangeLabel}>
            {speedState.maxSpeed.toFixed(1)}
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, !canDecrease && styles.buttonDisabled]}
          onPress={onSpeedDown}
          disabled={!canDecrease}
          testID="speed-down-button">
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !canIncrease && styles.buttonDisabled]}
          onPress={onSpeedUp}
          disabled={!canIncrease}
          testID="speed-up-button">
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  speedDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  speedValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#333',
  },
  speedUnit: {
    fontSize: 20,
    color: '#666',
    marginLeft: 8,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 20,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rangeLabel: {
    fontSize: 12,
    color: '#999',
  },
  controls: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
});
