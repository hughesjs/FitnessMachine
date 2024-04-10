// Could do with refactoring this and separating the two streams
import 'package:open_eqi_sports/modules/demo_ctrl/services/treadmill_state.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/services/workout_status.dart';

class TreadmillWorkoutUnion {
  TreadmillState treadmillState;
  WorkoutStatus workoutStatus;

  TreadmillWorkoutUnion(this.treadmillState, this.workoutStatus);

  factory TreadmillWorkoutUnion.initial() {
    return TreadmillWorkoutUnion(TreadmillState.initial(), WorkoutStatus.zero());
  }
}
