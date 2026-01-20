import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {DeviceDescriptor, getDeviceDisplayName} from '../models';

interface DeviceListItemProps {
  device: DeviceDescriptor;
  onPress: (device: DeviceDescriptor) => void;
  isConnecting?: boolean;
  disabled?: boolean;
}

export function DeviceListItem({
  device,
  onPress,
  isConnecting = false,
  disabled = false,
}: DeviceListItemProps): React.JSX.Element {
  const displayName = getDeviceDisplayName(device);
  const signalStrength = device.rssi != null ? `${device.rssi} dBm` : 'N/A';

  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={() => onPress(device)}
      disabled={disabled || isConnecting}
      testID={`device-item-${device.deviceId}`}>
      <View style={styles.content}>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.address}>{device.address}</Text>
      </View>
      <View style={styles.right}>
        {isConnecting ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <Text style={styles.signal}>{signalStrength}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  address: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  right: {
    marginLeft: 12,
  },
  signal: {
    fontSize: 12,
    color: '#999',
  },
});
