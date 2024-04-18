import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:open_eqi_sports/modules/hardware/services/treadmill_control_service.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/models/workout_status.dart';

class WorkoutStatusCubit extends Cubit<WorkoutStatus> {
  final TreadmillControlService _treadmillControlService;

  WorkoutStatusCubit(this._treadmillControlService) : super(WorkoutStatus.zero()) {
    _treadmillControlService.workoutStatusStream.listen((state) {
      emit(state);
    });
  }
}
