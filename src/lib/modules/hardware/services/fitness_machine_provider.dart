import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_service.dart';

class FitnessMachineProvider {
  FitnessMachine? currentMachine;

  bool get isSet => currentMachine != null;

  FitnessMachineProvider();

  Future<void> setMachine(BluetoothDevice device) async {
    currentMachine = await FitnessMachine.fromDevice(device);
  }
}
