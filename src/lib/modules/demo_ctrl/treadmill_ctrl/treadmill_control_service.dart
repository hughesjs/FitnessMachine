import 'package:flutter_blue_plus/flutter_blue_plus.dart';

class TreadmillControlService {
  BluetoothDevice? _device;
  BluetoothCharacteristic? _control;
  BluetoothCharacteristic? _workoutStatus;

  TreadmillControlService() {
    FlutterBluePlus.setLogLevel(LogLevel.verbose, color: false);
  }

  Future<void> connect() async {
    var subscription = FlutterBluePlus.onScanResults.listen(
      (results) async {
        if (results.isNotEmpty) {
          ScanResult r = results.last; // the most recently found device
          print('${r.device.remoteId}: "${r.advertisementData.advName}" found!');
          _device = r.device;
          FlutterBluePlus.stopScan();
          await _device!.connect();
          await _device!.discoverServices();
          var fitnessMachine = _device!.servicesList.firstWhere((s) => s.uuid == Guid("1826"));
          _control = fitnessMachine.characteristics.firstWhere((c) => c.uuid == Guid("2ad9"));
          _workoutStatus = fitnessMachine.characteristics.firstWhere((c) => c.uuid == Guid("2acd"));
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

  void pause() {
    // TODO: Implement pause method
    print('Pausing the treadmill');
  }

  void speedUp() {
    // TODO: Implement speedUp method
    print('Increasing the speed of the treadmill');
  }

  void speedDown() {
    // TODO: Implement speedDown method
    print('Decreasing the speed of the treadmill');
  }
}
