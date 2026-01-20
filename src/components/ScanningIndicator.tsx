import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';

interface ScanningIndicatorProps {
  isScanning: boolean;
}

export function ScanningIndicator({
  isScanning,
}: ScanningIndicatorProps): React.JSX.Element {
  if (!isScanning) {
    return <></>;
  }

  return (
    <View style={styles.container} testID="scanning-indicator">
      <ActivityIndicator size="small" color="#007AFF" />
      <Text style={styles.text}>Scanning for devices...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#f0f0f0',
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
});
