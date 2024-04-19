import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/hardware/services/treadmill_control_service.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/models/workout_status.dart';

class WorkoutStatusCubit extends Cubit<WorkoutStatus> {
  final TreadmillControlService _treadmillControlService;

  WorkoutStatusCubit()
      : _treadmillControlService = GetIt.I<TreadmillControlService>(),
        super(WorkoutStatus.zero()) {
    _treadmillControlService.workoutStatusStream.listen((state) {
      emit(state);
    });
  }
}
