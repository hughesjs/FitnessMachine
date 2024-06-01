import 'package:flutter_blue_plus/flutter_blue_plus.dart';

extension BluetoothDeviceExtensions on BluetoothDevice {
  BluetoothService getRequiredService(Guid uuid) {
    return servicesList.firstWhere((s) => s.uuid == uuid, orElse: () => throw Exception('Required service not found'));
  }
}
