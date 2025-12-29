import '../models/device_descriptor.dart';

class FitnessMachineDiscoveryState {
  final List<DeviceDescriptor> devices;
  final DeviceDescriptor? connectingDevice;
  final DeviceDescriptor? connectedDevice;

  FitnessMachineDiscoveryState({
    required this.devices,
    this.connectingDevice,
    this.connectedDevice,
  });

  FitnessMachineDiscoveryState copyWith({
    List<DeviceDescriptor>? devices,
    DeviceDescriptor? connectingDevice,
    DeviceDescriptor? connectedDevice,
  }) {
    return FitnessMachineDiscoveryState(
      devices: devices ?? this.devices,
      connectingDevice: connectingDevice,
      connectedDevice: connectedDevice,
    );
  }
}
