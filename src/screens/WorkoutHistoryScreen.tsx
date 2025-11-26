import React, {useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useWorkoutHistory} from '../contexts/WorkoutHistoryContext';
import {WorkoutHistoryItem, EmptyHistoryState} from '../components';
import {CompletedWorkout} from '../models';

interface WorkoutHistoryScreenProps {
  onWorkoutPress?: (workout: CompletedWorkout) => void;
}

export function WorkoutHistoryScreen({
  onWorkoutPress,
}: WorkoutHistoryScreenProps): React.JSX.Element {
  const {workouts, isLoading, error, refresh, deleteWorkout, deleteAllWorkouts} =
    useWorkoutHistory();

  const handleDeleteWorkout = useCallback(
    (workout: CompletedWorkout) => {
      Alert.alert(
        'Delete Workout',
        'Are you sure you want to delete this workout?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deleteWorkout(workout.workoutId),
          },
        ],
      );
    },
    [deleteWorkout],
  );

  const handleDeleteAll = useCallback(() => {
    if (workouts.length === 0) {
      return;
    }

    Alert.alert(
      'Delete All Workouts',
      'Are you sure you want to delete all workouts? This cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: deleteAllWorkouts,
        },
      ],
    );
  }, [workouts.length, deleteAllWorkouts]);

  const renderItem = useCallback(
    ({item}: {item: CompletedWorkout}) => (
      <WorkoutHistoryItem
        workout={item}
        {...(onWorkoutPress ? {onPress: onWorkoutPress} : {})}
        onDelete={handleDeleteWorkout}
      />
    ),
    [onWorkoutPress, handleDeleteWorkout],
  );

  const keyExtractor = useCallback(
    (item: CompletedWorkout) => item.workoutId,
    [],
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer} testID="loading-indicator">
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading workouts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workout History</Text>
        {workouts.length > 0 && (
          <TouchableOpacity
            onPress={handleDeleteAll}
            testID="delete-all-button">
            <Text style={styles.deleteAllText}>Delete All</Text>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer} testID="error-message">
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={refresh} testID="retry-button">
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {workouts.length === 0 && !error ? (
        <EmptyHistoryState />
      ) : (
        <FlatList
          data={workouts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={refresh}
          refreshing={isLoading}
          testID="workout-list"
        />
      )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteAllText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#FFEBEE',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    flex: 1,
  },
  retryText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  listContent: {
    paddingVertical: 8,
  },
});
