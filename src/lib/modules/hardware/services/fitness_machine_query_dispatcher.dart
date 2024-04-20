import 'dart:async';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/hardware/bt/models/treadmill_data.dart';
import 'package:open_eqi_sports/modules/hardware/bt/models/supported_speed_range.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_provider.dart';

class FitnessMachineQueryDispatcher {
  bool get isConnected => _currentMachine != null;

  final FitnessMachineProvider _fitnessMachineProvider;

  final StreamController<TreadmillData> _treadmillDataStreamController;
  final StreamController<SupportedSpeedRange> _supportedSpeedRangeStreamController;

  Stream get treadmillDataStream => _treadmillDataStreamController.stream;
  Stream get supportedSpeedRangeStream => _supportedSpeedRangeStreamController.stream;

  StreamSubscription? _machineStatusSubscription;
  FitnessMachine? _currentMachine;

  FitnessMachineQueryDispatcher()
      : _fitnessMachineProvider = GetIt.I<FitnessMachineProvider>(),
        _treadmillDataStreamController = StreamController<TreadmillData>.broadcast(),
        _supportedSpeedRangeStreamController = StreamController<SupportedSpeedRange>.broadcast() {
    _fitnessMachineProvider.currentMachineStream.listen((currentMachine) async {
      _currentMachine = currentMachine;
      await _reconnectStreams();
      await refreshSupportedSpeedRange();
    });

    // In-case we miss the first one
    _supportedSpeedRangeStreamController.onListen = () async {
      await refreshSupportedSpeedRange();
    };
  }

  Future<void> refreshSupportedSpeedRange() async {
    if (_currentMachine == null) return;
    List<int> rawSpeeds = await _currentMachine!.supportedSpeeds.read();
    _supportedSpeedRangeStreamController.add(SupportedSpeedRange.fromBytes(rawSpeeds));
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
