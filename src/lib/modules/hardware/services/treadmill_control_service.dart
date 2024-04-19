import 'dart:async';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/hardware/bt/models/supported_speed_range.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_command_dispatcher.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_query_dispatcher.dart';

class TreadmillControlService {
  late Stream workoutStatusStream;

  double _requestedSpeed = 0;

  final FitnessMachineCommandDispatcher _fitnessMachineCommandDispatcher;
  final FitnessMachineQueryDispatcher _fitnessMachineQueryDispatcher;

  SupportedSpeedRange? _supportedSpeedRange;

  TreadmillControlService()
      : _fitnessMachineCommandDispatcher = GetIt.I<FitnessMachineCommandDispatcher>(),
        _fitnessMachineQueryDispatcher = GetIt.I<FitnessMachineQueryDispatcher>() {
    workoutStatusStream = _fitnessMachineQueryDispatcher.treadmillDataStream;
  }

  Future<void> takeControl() async => _fitnessMachineCommandDispatcher.takeControl();

  Future<void> start() async {
    _fitnessMachineCommandDispatcher.start();
  }

  Future<void> stop() async => _fitnessMachineCommandDispatcher.stop();

  Future<void> pause() async => _fitnessMachineCommandDispatcher.pause();

  Future<void> resume() async => _fitnessMachineCommandDispatcher.resume();

  Future<void> speedUp() async {
    _supportedSpeedRange ??= await _fitnessMachineQueryDispatcher.getSupportedSpeedRange();
    _requestedSpeed = _clampValue(_requestedSpeed + 0.5, _supportedSpeedRange!.minSpeedInKmh, _supportedSpeedRange!.maxSpeedInKmh);
    await _setSpeed(_requestedSpeed);
  }

  Future<void> speedDown() async {
    _supportedSpeedRange ??= await _fitnessMachineQueryDispatcher.getSupportedSpeedRange();
    _requestedSpeed = _clampValue(_requestedSpeed - 0.5, _supportedSpeedRange!.minSpeedInKmh, _supportedSpeedRange!.maxSpeedInKmh);
    await _setSpeed(_requestedSpeed);
  }

  Future<void> _setSpeed(double speed) async => _fitnessMachineCommandDispatcher.setSpeed(speed);

  static double _clampValue(double value, min, max) {
    if (value < min) {
      return min;
    }
    if (value > max) {
      return max;
    }
    return value;
  }
}
