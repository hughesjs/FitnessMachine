import 'package:flutter_blue_plus/flutter_blue_plus.dart';

extension BluetoothServiceExtensions on BluetoothService {
  BluetoothCharacteristic getRequiredCharacteristic(Guid uuid) {
    return characteristics.firstWhere((s) => s.uuid == uuid, orElse: () => throw Exception('Required characteristic not found'));
  }
}
