import 'dart:async';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/hardware/bt/models/supported_speed_range.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_command_dispatcher.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_query_dispatcher.dart';

class TreadmillControlService {
  late Stream workoutStatusStream;

  final FitnessMachineCommandDispatcher _fitnessMachineCommandDispatcher;
  final FitnessMachineQueryDispatcher _fitnessMachineQueryDispatcher;

  SupportedSpeedRange _supportedSpeedRange = SupportedSpeedRange(0, 0, 0);

  TreadmillControlService()
      : _fitnessMachineCommandDispatcher = GetIt.I<FitnessMachineCommandDispatcher>(),
        _fitnessMachineQueryDispatcher = GetIt.I<FitnessMachineQueryDispatcher>() {
    workoutStatusStream = _fitnessMachineQueryDispatcher.treadmillDataStream;
    _fitnessMachineQueryDispatcher.supportedSpeedRangeStream.listen((event) {
      _supportedSpeedRange = event;
    });
  }

  Future<void> takeControl() async => _fitnessMachineCommandDispatcher.takeControl();

  Future<void> start() async => _fitnessMachineCommandDispatcher.start();

  Future<void> stop() async => _fitnessMachineCommandDispatcher.stop();

  Future<void> pause() async => _fitnessMachineCommandDispatcher.pause();

  Future<void> resume() async => _fitnessMachineCommandDispatcher.resume();
}
