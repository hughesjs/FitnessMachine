import 'dart:async';
import 'dart:typed_data';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/services/models/treadmill_state.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/services/models/workout_status.dart';

class TreadmillControlService implements Disposable {
  BluetoothDevice? _device;
  BluetoothCharacteristic? _control;
  BluetoothCharacteristic? _workoutStatusUpdate;

  // Double underscore to ensure you use the setter
  double __requestedSpeed = 0;

  static const double minSpeed = 1;
  static const double maxSpeed = 6;

  final StreamController<WorkoutStatus> _workoutStatusStreamController;
  final StreamController<TreadmillState> _treadmillStateStreamController;

  late Stream workoutStatusStream;
  late Stream treadmillStateStream;

  TreadmillControlService()
      : _workoutStatusStreamController = StreamController<WorkoutStatus>.broadcast(),
        _treadmillStateStreamController = StreamController<TreadmillState>.broadcast() {
    workoutStatusStream = _workoutStatusStreamController.stream;
    treadmillStateStream = _treadmillStateStreamController.stream;
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
          await _setupServices();
          await _wakeup();
        }
      },
      onError: (e) => print(e),
    );
    FlutterBluePlus.cancelWhenScanComplete(subscription);

    await FlutterBluePlus.startScan(withServices: [Guid("1826")], withNames: ["CITYSPORTS-Linker"], timeout: const Duration(seconds: 15));
  }

  Future<void> _wakeup() async {
    await _control!.write([0x00]);
  }

  Future<void> start() async {
    await _control!.write([0x07]);
  }

  Future<void> stop() async {
    await _control!.write([0x08, 0x01]);
  }

  Future<void> _setSpeed(double speed) async {
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
    _requestedSpeed += 0.5;
    await _setSpeed(_requestedSpeed);
    print('Increasing the speed of the treadmill to $_requestedSpeed km/h');
  }

  Future<void> speedDown() async {
    _requestedSpeed -= 0.5;
    await _setSpeed(_requestedSpeed);
    print('Decreasing the speed of the treadmill to $_requestedSpeed km/h');
  }

  void _processStatusUpdate(List<int> value) {
    final workoutStatus = WorkoutStatus.fromBytes(value);
    // Make a factory for this or something
    final treadmillState = TreadmillState(
        speedState: workoutStatus.speedInKmh == _requestedSpeed
            ? SpeedState.steady
            : workoutStatus.speedInKmh < _requestedSpeed
                ? SpeedState.increasing
                : SpeedState.decreasing,
        connectionState: _device!.isConnected ? ConnectionState.connected : ConnectionState.disconnected,
        requestedSpeed: _requestedSpeed,
        currentSpeed: workoutStatus.speedInKmh);
    _workoutStatusStreamController.add(workoutStatus);
    _treadmillStateStreamController.add(treadmillState);
  }

  Future<void> _setupServices() async {
    await _device!.discoverServices();
    var fitnessMachine = _device!.servicesList.firstWhere((s) => s.uuid == Guid("1826"));
    _control = fitnessMachine.characteristics.firstWhere((c) => c.uuid == Guid("2ad9"));
    _workoutStatusUpdate = fitnessMachine.characteristics.firstWhere((c) => c.uuid == Guid("2acd"));
    _workoutStatusUpdate!.onValueReceived.listen(_processStatusUpdate);
    _workoutStatusUpdate!.setNotifyValue(true);
  }

  set _requestedSpeed(double value) {
    if (value < minSpeed) {
      value = minSpeed;
    } else if (value > maxSpeed) {
      value = maxSpeed;
    }
    __requestedSpeed = value;
  }

  double get _requestedSpeed => __requestedSpeed;

  @override
  FutureOr onDispose() {
    _device?.disconnect();
    ;
  }
}
