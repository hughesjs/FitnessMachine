import 'package:flutter_blue_plus/flutter_blue_plus.dart';

class DeviceDescriptor {
  final BluetoothDevice device;
  final String name;
  final String address;

  DeviceDescriptor(this.device, this.name, this.address);
}
