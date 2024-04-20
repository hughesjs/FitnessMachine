import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/hardware/services/treadmill_control_service.dart';
import 'package:open_eqi_sports/modules/hardware/bt/models/treadmill_data.dart';

class TrainingStatusCubit extends Cubit<TreadmillData> {
  final TreadmillControlService _treadmillControlService;
  late StreamSubscription _sub;

  TrainingStatusCubit()
      : _treadmillControlService = GetIt.I<TreadmillControlService>(),
        super(TreadmillData.zero()) {
    _sub = _treadmillControlService.workoutStatusStream.listen((state) {
      emit(state);
    });
  }

  @override
  Future<void> close() async {
    _sub.cancel();
    super.close();
  }
}
