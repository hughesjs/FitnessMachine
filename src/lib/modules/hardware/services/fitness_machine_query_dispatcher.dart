import 'dart:async';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/models/workout_status.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_provider.dart';

class FitnessMachineQueryDispatcher {
  final FitnessMachineProvider _fitnessMachineProvider;

  final StreamController<TreadmillData> _treadmillDataStreamController;
  Stream get treadmillDataStream => _treadmillDataStreamController.stream;

  StreamSubscription? _machineStatusSubscription;

  FitnessMachineQueryDispatcher()
      : _fitnessMachineProvider = GetIt.I<FitnessMachineProvider>(),
        _treadmillDataStreamController = StreamController<TreadmillData>.broadcast() {
    _fitnessMachineProvider.currentMachineStream.listen((currentMachine) async => await _reconnectStreams(currentMachine));
  }

  Future<void> _reconnectStreams(FitnessMachine currentMachine) async {
    _machineStatusSubscription?.cancel();
    _machineStatusSubscription = currentMachine.treadmillData.onValueReceived.listen(_processTreadmillDataUpdate);
    await currentMachine.treadmillData.setNotifyValue(true);
  }

  void _processTreadmillDataUpdate(List<int> value) {
    final TreadmillData treadmillData = TreadmillData.fromBytes(value);
    _treadmillDataStreamController.add(treadmillData);
  }
}
