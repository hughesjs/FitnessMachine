import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:open_eqi_sports/modules/hardware/bt/constants/known_characteristics.dart';
import 'package:open_eqi_sports/modules/hardware/bt/constants/known_services.dart';
import 'package:open_eqi_sports/modules/hardware/bt/extensions/bluetooth_device_extensions.dart';
import 'package:open_eqi_sports/modules/hardware/bt/extensions/bluetooth_service_extensions.dart';

class FitnessMachine {
  final BluetoothService fitnessMachineService;

  final BluetoothCharacteristic fitnessMachineFeature;
  final BluetoothCharacteristic fitnessMachineControl;
  final BluetoothCharacteristic fitnessMachineStatus;
  final BluetoothCharacteristic treadmillData;
  final BluetoothCharacteristic trainingStatus;
  final BluetoothCharacteristic supportedSpeeds;

  late List<BluetoothCharacteristic> characteristics = [
    fitnessMachineFeature,
    fitnessMachineControl,
    fitnessMachineStatus,
    treadmillData,
    trainingStatus,
    supportedSpeeds,
  ];

  FitnessMachine._(
    this.fitnessMachineService,
    this.fitnessMachineFeature,
    this.fitnessMachineControl,
    this.fitnessMachineStatus,
    this.treadmillData,
    this.trainingStatus,
    this.supportedSpeeds,
  );

  static Future<FitnessMachine> fromDevice(BluetoothDevice device) async {
    if (!device.isConnected) {
      await device.connect();
    }

    await device.discoverServices();
    final fitnessMachineService = device.getRequiredService(KnownServices.fitnessMachine);

    final fitnessMachineFeature = fitnessMachineService.getRequiredCharacteristic(KnownCharacteristics.fitnessMachineFeature);
    final fitnessMachineControl = fitnessMachineService.getRequiredCharacteristic(KnownCharacteristics.fitnessMachineControl);
    final fitnessMachineStatus = fitnessMachineService.getRequiredCharacteristic(KnownCharacteristics.fitnessMachineStatus);
    final treadmillData = fitnessMachineService.getRequiredCharacteristic(KnownCharacteristics.treadmillData);
    final trainingStatus = fitnessMachineService.getRequiredCharacteristic(KnownCharacteristics.trainingStatus);
    final supportedSpeeds = fitnessMachineService.getRequiredCharacteristic(KnownCharacteristics.supportedSpeeds);

    return FitnessMachine._(
      fitnessMachineService,
      fitnessMachineFeature,
      fitnessMachineControl,
      fitnessMachineStatus,
      treadmillData,
      trainingStatus,
      supportedSpeeds,
    );
  }
}
