import 'dart:async';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_command_dispatcher.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_query_dispatcher.dart';

class TreadmillControlService {
  // TODO Read this from the device
  static const double minSpeed = 1;
  static const double maxSpeed = 6;

  late Stream workoutStatusStream;

  // Double underscore to ensure you use the setter
  // ^^ This is shit... do something else
  double __requestedSpeed = 0;
  double get _requestedSpeed => __requestedSpeed;

  final FitnessMachineCommandDispatcher _fitnessMachineCommandDispatcher;
  final FitnessMachineQueryDispatcher _fitnessMachineQueryDispatcher;

  TreadmillControlService()
      : _fitnessMachineCommandDispatcher = GetIt.I<FitnessMachineCommandDispatcher>(),
        _fitnessMachineQueryDispatcher = GetIt.I<FitnessMachineQueryDispatcher>() {
    workoutStatusStream = _fitnessMachineQueryDispatcher.treadmillDataStream;
  }

  Future<void> takeControl() async => _fitnessMachineCommandDispatcher.takeControl();

  Future<void> start() async => _fitnessMachineCommandDispatcher.start();

  Future<void> stop() async => _fitnessMachineCommandDispatcher.stop();

  Future<void> pause() async => _fitnessMachineCommandDispatcher.pause();

  Future<void> resume() async => _fitnessMachineCommandDispatcher.resume();

  Future<void> speedUp() async {
    _requestedSpeed += 0.5;
    await _setSpeed(_requestedSpeed);
  }

  Future<void> speedDown() async {
    _requestedSpeed -= 0.5;
    await _setSpeed(_requestedSpeed);
  }

  Future<void> _setSpeed(double speed) async => _fitnessMachineCommandDispatcher.setSpeed(speed);

  set _requestedSpeed(double value) {
    if (value < minSpeed) {
      value = minSpeed;
    } else if (value > maxSpeed) {
      value = maxSpeed;
    }
    __requestedSpeed = value;
  }
}
