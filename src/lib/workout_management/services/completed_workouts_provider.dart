import 'dart:async';

import 'package:fitness_machine/workout_management/models/completed_workout.dart';
import 'package:fitness_machine/workout_management/repositories/completed_workouts_repository.dart';
import 'package:fitness_machine/workout_management/services/workout_state_manager.dart';
import 'package:get_it/get_it.dart';

class CompletedWorkoutsProvider {

  // Maybe we don't re-emit the whole list every time
  // But this will do for now
  Stream<List<CompletedWorkout>> get completedWorkoutsStream => _completedWorkoutsStreamController.stream;
  
  final StreamController<List<CompletedWorkout>> _completedWorkoutsStreamController;
  
  final CompletedWorkoutsRepository _completedWorkoutsRepository;
  final WorkoutStateManager _workoutStateManager;
  
  List<CompletedWorkout> completedWorkouts = [];

  CompletedWorkoutsProvider(): 
  _completedWorkoutsRepository = GetIt.I<CompletedWorkoutsRepository>(),
  _workoutStateManager = GetIt.I<WorkoutStateManager>(),
  _completedWorkoutsStreamController = StreamController<List<CompletedWorkout>>.broadcast() {
    refreshFromRepository();

    _workoutStateManager.workoutCompletedStream.listen((_) {
      refreshFromRepository();
    });
  }  

  Future<void> refreshFromRepository() async {
    completedWorkouts = await _completedWorkoutsRepository.getCompletedWorkouts();
    _completedWorkoutsStreamController.add(completedWorkouts);
  }
}