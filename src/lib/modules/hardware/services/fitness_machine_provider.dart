import 'dart:async';

import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine.dart';

class FitnessMachineProvider {
  StreamController<FitnessMachine> currentMachineStreamController;
  Stream<FitnessMachine> get currentMachineStream => currentMachineStreamController.stream;

  FitnessMachineProvider() : currentMachineStreamController = StreamController<FitnessMachine>.broadcast();

  Future<void> setMachine(BluetoothDevice device) async {
    final currentMachine = await FitnessMachine.fromDevice(device);
    currentMachineStreamController.add(currentMachine);
  }
}
