import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:fitness_machine/modules/demo_ctrl/models/speed_state.dart';
import 'package:fitness_machine/modules/hardware/services/fitness_machine_command_dispatcher.dart';
import 'package:fitness_machine/modules/hardware/services/fitness_machine_query_dispatcher.dart';

class SpeedRangeAndSettingCubit extends Cubit<SpeedState> {
  final FitnessMachineQueryDispatcher _fitnessMachineQueryDispatcher;
  final FitnessMachineCommandDispatcher _fitnessMachineCommandDispatcher;

  StreamSubscription? _speedRangeSub;
  StreamSubscription? _sub;

  SpeedState _lastState = const SpeedState.zero();

  SpeedRangeAndSettingCubit(super.initialState)
      : _fitnessMachineQueryDispatcher = GetIt.I<FitnessMachineQueryDispatcher>(),
        _fitnessMachineCommandDispatcher = GetIt.I<FitnessMachineCommandDispatcher>() {
    _sub = _fitnessMachineQueryDispatcher.treadmillDataStream.listen((update) {
      SpeedState state = _lastState.copyWith(speedInKmh: update.speedInKmh);
      emit(state);
      _lastState = state;
    });

    _speedRangeSub = _fitnessMachineQueryDispatcher.supportedSpeedRangeStream.listen((range) {
      SpeedState state = _lastState.copyWith(minSpeed: range.minSpeedInKmh, maxSpeed: range.maxSpeedInKmh);
      emit(state);
      _lastState = state;
    });
  }

  Future<void> speedUp() async => await _setSpeed(_lastState.speedInKmh + 0.5);

  Future<void> speedDown() async => await _setSpeed(_lastState.speedInKmh - 0.5);

  Future<void> _setSpeed(double speed) async {
    final requestedSpeed = _clampValue(speed, _lastState.minSpeed, _lastState.maxSpeed);
    _fitnessMachineCommandDispatcher.setSpeed(requestedSpeed);
  }

  static double _clampValue(double value, min, max) {
    if (value < min) {
      return min;
    }
    if (value > max) {
      return max;
    }
    return value;
  }

  @override
  Future<void> close() async {
    _sub?.cancel();
    _speedRangeSub?.cancel();
    super.close();
  }
}
