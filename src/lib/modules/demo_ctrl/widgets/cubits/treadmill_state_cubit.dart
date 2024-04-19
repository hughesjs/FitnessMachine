import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/hardware/services/treadmill_control_service.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/models/treadmill_state.dart';

class TreadmillStateCubit extends Cubit<TreadmillState> {
  final TreadmillControlService _treadmillControlService;

  TreadmillStateCubit()
      : _treadmillControlService = GetIt.I<TreadmillControlService>(),
        super(TreadmillState.initial()) {
    _treadmillControlService.treadmillStateStream.listen((state) {
      emit(state);
    });
  }

  void connect() => _treadmillControlService.connect();

  void start() => _treadmillControlService.start();

  void stop() => _treadmillControlService.stop();

  void speedUp() => _treadmillControlService.speedUp();

  void speedDown() => _treadmillControlService.speedDown();
}
