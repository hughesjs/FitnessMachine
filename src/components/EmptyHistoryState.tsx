import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface EmptyHistoryStateProps {
  message?: string;
}

export function EmptyHistoryState({
  message = 'No workouts yet',
}: EmptyHistoryStateProps): React.JSX.Element {
  return (
    <View style={styles.container} testID="empty-history-state">
      <Text style={styles.title}>{message}</Text>
      <Text style={styles.subtitle}>
        Complete a workout to see it here
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
