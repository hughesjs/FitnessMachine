import 'dart:async';

import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:get_it/get_it.dart';
import 'package:logger/logger.dart';
import 'package:fitness_machine/modules/hardware/services/fitness_machine.dart';

class FitnessMachineProvider {

  FitnessMachine? currentMachine;

  final Logger _logger;

  StreamController<FitnessMachine?> currentMachineStreamController;
  Stream<FitnessMachine?> get currentMachineStream => currentMachineStreamController.stream;

  FitnessMachineProvider() : currentMachineStreamController = StreamController<FitnessMachine?>.broadcast(), _logger = GetIt.I<Logger>();

  Future<void> setMachine(BluetoothDevice device) async {
    FlutterBluePlus.events.onConnectionStateChanged.listen((event) async {
      if (event.device == device) {
        if (event.connectionState != BluetoothConnectionState.connected) {
          _logger.w("Device disconnected unexpectedly");
          await unsetMachine();
        }
      }
    });

    currentMachine = await FitnessMachine.fromDevice(device);
    currentMachineStreamController.add(currentMachine);
  }

  Future<void> unsetMachine() async {
    currentMachineStreamController.add(null);
    currentMachine = null;
  }
}
