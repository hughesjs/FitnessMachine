import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  CompletedWorkout,
  formatWorkoutDuration,
  formatWorkoutDate,
  formatWorkoutTime,
  formatDistance,
} from '../models';

interface WorkoutHistoryItemProps {
  workout: CompletedWorkout;
  onPress?: (workout: CompletedWorkout) => void;
  onDelete?: (workout: CompletedWorkout) => void;
}

export function WorkoutHistoryItem({
  workout,
  onPress,
  onDelete,
}: WorkoutHistoryItemProps): React.JSX.Element {
  const handlePress = () => {
    onPress?.(workout);
  };

  const handleDelete = () => {
    onDelete?.(workout);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      disabled={!onPress}
      testID={`workout-item-${workout.workoutId}`}>
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>{formatWorkoutDate(workout.completedAt)}</Text>
          <Text style={styles.time}>{formatWorkoutTime(workout.completedAt)}</Text>
        </View>
        {onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            testID={`delete-workout-${workout.workoutId}`}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {formatDistance(workout.distanceInKm)}
          </Text>
          <Text style={styles.statLabel}>km</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {formatWorkoutDuration(workout.workoutTimeInSeconds)}
          </Text>
          <Text style={styles.statLabel}>duration</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{workout.totalSteps.toLocaleString()}</Text>
          <Text style={styles.statLabel}>steps</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{workout.calculatedCalories}</Text>
          <Text style={styles.statLabel}>kcal</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  time: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});
