import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/services/treadmill_control_service.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/services/models/treadmill_state.dart';

class TreadmillStateCubit extends Cubit<TreadmillState> {
  final TreadmillControlService _treadmillControlService;

  TreadmillStateCubit(this._treadmillControlService) : super(TreadmillState.initial()) {
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
