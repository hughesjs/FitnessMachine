import 'dart:async';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/hardware/bt/models/treadmill_data.dart';
import 'package:open_eqi_sports/modules/hardware/bt/models/supported_speed_range.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_provider.dart';

class FitnessMachineQueryDispatcher {
  final FitnessMachineProvider _fitnessMachineProvider;

  final StreamController<TreadmillData> _treadmillDataStreamController;
  Stream get treadmillDataStream => _treadmillDataStreamController.stream;

  StreamSubscription? _machineStatusSubscription;
  FitnessMachine? _currentMachine;

  FitnessMachineQueryDispatcher()
      : _fitnessMachineProvider = GetIt.I<FitnessMachineProvider>(),
        _treadmillDataStreamController = StreamController<TreadmillData>.broadcast() {
    _fitnessMachineProvider.currentMachineStream.listen((currentMachine) async {
      _currentMachine = currentMachine;
      await _reconnectStreams();
    });
  }

  Future<SupportedSpeedRange> getSupportedSpeedRange() async {
    if (_currentMachine == null) return SupportedSpeedRange(0, 0, 0);
    List<int> rawSpeeds = await _currentMachine!.supportedSpeeds.read();
    return SupportedSpeedRange.fromBytes(rawSpeeds);
  }

  Future<void> _reconnectStreams() async {
    if (_currentMachine == null) return;
    _machineStatusSubscription?.cancel();
    _machineStatusSubscription = _currentMachine!.treadmillData.onValueReceived.listen(_processTreadmillDataUpdate);
    await _currentMachine!.treadmillData.setNotifyValue(true);
  }

  void _processTreadmillDataUpdate(List<int> value) {
    final TreadmillData treadmillData = TreadmillData.fromBytes(value);
    _treadmillDataStreamController.add(treadmillData);
  }
}
