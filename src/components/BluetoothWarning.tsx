import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BluetoothState, getBluetoothStateMessage} from '../services/ble';

interface BluetoothWarningProps {
  bluetoothState: BluetoothState;
}

export function BluetoothWarning({
  bluetoothState,
}: BluetoothWarningProps): React.JSX.Element | null {
  if (bluetoothState === BluetoothState.PoweredOn) {
    return null;
  }

  const message = getBluetoothStateMessage(bluetoothState);

  return (
    <View style={styles.container} testID="bluetooth-warning">
      <Text style={styles.icon}>&#x26A0;</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF3CD',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE69C',
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: '#856404',
  },
});
