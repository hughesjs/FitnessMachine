import 'dart:typed_data';

import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/treadmill_ctrl/treadmill_status.dart';

class TreadmillControlService {
  BluetoothDevice? _device;
  BluetoothCharacteristic? _control;
  BluetoothCharacteristic? _workoutStatus;

  // Double underscore to ensure you use the setter
  double __requestedSpeed = 0;

  WorkoutStatus? _status;

  static const double minSpeed = 1;
  static const double maxSpeed = 6;

  TreadmillControlService() {
    FlutterBluePlus.setLogLevel(LogLevel.warning, color: false);
  }

  Future<void> connect() async {
    var subscription = FlutterBluePlus.onScanResults.listen(
      (results) async {
        if (results.isNotEmpty) {
          ScanResult r = results.single;
          _device = r.device;
          FlutterBluePlus.stopScan();
          await _device!.connect();
          await setupServices();
          await wakeup();
        }
      },
      onError: (e) => print(e),
    );
    FlutterBluePlus.cancelWhenScanComplete(subscription);

    await FlutterBluePlus.startScan(
        withServices: [Guid("1826")], withNames: ["CITYSPORTS-Linker"], timeout: const Duration(seconds: 15));
  }

  Future<void> wakeup() async {
    await _control!.write([0x00]);
  }

  Future<void> start() async {
    await _control!.write([0x07]);
  }

  Future<void> stop() async {
    await _control!.write([0x08, 0x01]);
  }

  Future<void> setSpeed(double speed) async {
    int requestSpeed = (speed * 100).toInt();
    ByteData bytes = ByteData(3);
    bytes.setUint8(0, 0x02);
    bytes.setUint16(1, requestSpeed, Endian.little);
    await _control!.write(bytes.buffer.asUint8List());
  }

  void pause() {
    // TODO: Implement pause method
    print('Pausing the treadmill');
  }

  Future<void> speedUp() async {
    requestedSpeed += 0.5;
    await setSpeed(requestedSpeed);
    print('Increasing the speed of the treadmill to $requestedSpeed km/h');
  }

  Future<void> speedDown() async {
    requestedSpeed -= 0.5;
    await setSpeed(requestedSpeed);
    print('Decreasing the speed of the treadmill to $requestedSpeed km/h');
  }

  void processStatusUpdate(List<int> value) {
    _status = WorkoutStatus.fromBytes(value);
  }

  Future<void> setupServices() async {
    await _device!.discoverServices();
    var fitnessMachine = _device!.servicesList.firstWhere((s) => s.uuid == Guid("1826"));
    _control = fitnessMachine.characteristics.firstWhere((c) => c.uuid == Guid("2ad9"));
    _workoutStatus = fitnessMachine.characteristics.firstWhere((c) => c.uuid == Guid("2acd"));
    _workoutStatus!.onValueReceived.listen(processStatusUpdate);
    _workoutStatus!.setNotifyValue(true);
  }

  set requestedSpeed(double value) {
    if (value < minSpeed) {
      value = minSpeed;
    } else if (value > maxSpeed) {
      value = maxSpeed;
    }
    __requestedSpeed = value;
  }

  double get requestedSpeed => __requestedSpeed;
}
