import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {useBle} from '../contexts';
import {DeviceDescriptor, sortDevicesBySignal} from '../models';
import {DeviceListItem, ScanningIndicator, BluetoothWarning} from '../components';

interface DeviceSelectionScreenProps {
  onDeviceConnected?: () => void;
  onCancel?: () => void;
}

export function DeviceSelectionScreen({
  onDeviceConnected,
  onCancel,
}: DeviceSelectionScreenProps): React.JSX.Element {
  const {
    bluetoothState,
    isBluetoothReady,
    isScanning,
    discoveredDevices,
    startScan,
    stopScan,
    connectToDevice,
    error,
    clearError,
  } = useBle();

  const [connectingDeviceId, setConnectingDeviceId] = useState<string | null>(null);

  // Start scanning on mount
  useEffect(() => {
    if (isBluetoothReady) {
      startScan();
    }

    return () => {
      stopScan();
    };
  }, [isBluetoothReady, startScan, stopScan]);

  const handleDevicePress = async (device: DeviceDescriptor) => {
    setConnectingDeviceId(device.deviceId);
    clearError();

    const success = await connectToDevice(device);

    setConnectingDeviceId(null);

    if (success) {
      onDeviceConnected?.();
    }
  };

  const handleScanToggle = () => {
    if (isScanning) {
      stopScan();
    } else {
      startScan();
    }
  };

  const sortedDevices = sortDevicesBySignal(discoveredDevices);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Device</Text>
        {onCancel && (
          <TouchableOpacity onPress={onCancel} testID="cancel-button">
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      <BluetoothWarning bluetoothState={bluetoothState} />
      <ScanningIndicator isScanning={isScanning} />

      {error && (
        <View style={styles.errorContainer} testID="error-message">
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={sortedDevices}
        keyExtractor={item => item.deviceId}
        renderItem={({item}) => (
          <DeviceListItem
            device={item}
            onPress={handleDevicePress}
            isConnecting={connectingDeviceId === item.deviceId}
            disabled={connectingDeviceId !== null}
          />
        )}
        ListEmptyComponent={
          !isScanning ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No devices found</Text>
              <Text style={styles.emptySubtext}>
                Make sure your fitness machine is powered on and nearby
              </Text>
            </View>
          ) : null
        }
        testID="device-list"
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.scanButton,
            !isBluetoothReady && styles.scanButtonDisabled,
          ]}
          onPress={handleScanToggle}
          disabled={!isBluetoothReady}
          testID="scan-button">
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Stop Scanning' : 'Scan for Devices'}
          </Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cancelButton: {
    fontSize: 16,
    color: '#007AFF',
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
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  scanButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  scanButtonDisabled: {
    backgroundColor: '#ccc',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
