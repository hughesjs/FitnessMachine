import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TreadmillData, formatTime, formatDistance} from '../models';

interface WorkoutStatusPanelProps {
  data: TreadmillData;
}

interface MetricCardProps {
  label: string;
  value: string;
  unit: string;
  testID?: string;
}

function MetricCard({label, value, unit, testID}: MetricCardProps): React.JSX.Element {
  return (
    <View style={styles.card} testID={testID}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardUnit}>{unit}</Text>
    </View>
  );
}

export function WorkoutStatusPanel({
  data,
}: WorkoutStatusPanelProps): React.JSX.Element {
  return (
    <View style={styles.container} testID="workout-status-panel">
      <View style={styles.row}>
        <MetricCard
          label="Distance"
          value={formatDistance(data.distanceInKm)}
          unit="km"
          testID="metric-distance"
        />
        <MetricCard
          label="Time"
          value={formatTime(data.timeInSeconds)}
          unit=""
          testID="metric-time"
        />
      </View>
      <View style={styles.row}>
        <MetricCard
          label="Steps"
          value={data.steps.toLocaleString()}
          unit="steps"
          testID="metric-steps"
        />
        <MetricCard
          label="Calories"
          value={data.indicatedKiloCalories.toString()}
          unit="kcal"
          testID="metric-calories"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  card: {
    flex: 1,
    padding: 16,
    marginHorizontal: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cardUnit: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});
