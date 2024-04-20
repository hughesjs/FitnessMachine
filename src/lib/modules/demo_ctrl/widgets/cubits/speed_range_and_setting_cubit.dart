import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/models/speed_state.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_query_dispatcher.dart';

class SpeedRangeAndSettingCubit extends Cubit<SpeedState> {
  final FitnessMachineQueryDispatcher _fitnessMachineQueryDispatcher;

  StreamSubscription? _speedRangeSub;
  StreamSubscription? _sub;

  SpeedState _lastState = const SpeedState.zero();

  SpeedRangeAndSettingCubit(super.initialState) : _fitnessMachineQueryDispatcher = GetIt.I<FitnessMachineQueryDispatcher>() {
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

  @override
  Future<void> close() async {
    _sub?.cancel();
    _speedRangeSub?.cancel();
    super.close();
  }
}
