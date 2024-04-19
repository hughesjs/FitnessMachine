import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:open_eqi_sports/modules/hardware/bt/constants/known_characteristics.dart';
import 'package:open_eqi_sports/modules/hardware/bt/constants/known_services.dart';
import 'package:open_eqi_sports/modules/hardware/bt/extensions/bluetooth_device_extensions.dart';
import 'package:open_eqi_sports/modules/hardware/bt/extensions/bluetooth_service_extensions.dart';

class FitnessMachine {
  final BluetoothService _fitnessMachineService;

  final BluetoothCharacteristic _fitnessMachineFeature;
  final BluetoothCharacteristic _fitnessMachineControl;
  final BluetoothCharacteristic _fitnessMachineStatus;
  final BluetoothCharacteristic _treadmillData;
  final BluetoothCharacteristic _trainingStatus;
  final BluetoothCharacteristic _supportedSpeeds;

  FitnessMachine._(
    this._fitnessMachineService,
    this._fitnessMachineFeature,
    this._fitnessMachineControl,
    this._fitnessMachineStatus,
    this._treadmillData,
    this._trainingStatus,
    this._supportedSpeeds,
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
