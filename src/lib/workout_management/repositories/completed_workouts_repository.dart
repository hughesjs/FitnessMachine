import 'package:fitness_machine/workout_management/models/completed_workout.dart';
import 'package:fitness_machine/workout_management/services/workout_state_manager.dart';
import 'package:get_it/get_it.dart';
import 'package:logger/logger.dart';

class CompletedWorkoutsRepository {
  final Logger _logger;
  final WorkoutStateManager _workoutStateManager;

  // TODO: replace this with a DB
  final List<CompletedWorkout> _completedWorkouts = [];

  CompletedWorkoutsRepository(): _logger = GetIt.I<Logger>(),
  _workoutStateManager = GetIt.I<WorkoutStateManager>() {
    _workoutStateManager.workoutCompletedStream.listen((completedWorkout) => addCompletedWorkout(completedWorkout));
  }

  Future<List<CompletedWorkout>> getCompletedWorkouts() async {
    return _completedWorkouts;
  }

  Future<void> addCompletedWorkout(CompletedWorkout completedWorkout) async {
    _completedWorkouts.add(completedWorkout);
    _logger.i("Added completed workout to repository: ${completedWorkout.workoutId}");
  }
}