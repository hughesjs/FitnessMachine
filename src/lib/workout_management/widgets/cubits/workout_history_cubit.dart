import 'dart:async';

import 'package:fitness_machine/workout_management/models/completed_workout.dart';
import 'package:fitness_machine/workout_management/services/completed_workouts_provider.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';

class WorkoutHistoryCubit extends Cubit<List<CompletedWorkout>> {

  final CompletedWorkoutsProvider _completedWorkoutsProvider;

  late StreamSubscription _sub;



  WorkoutHistoryCubit() : _completedWorkoutsProvider = GetIt.I<CompletedWorkoutsProvider>(), super([]) {
    _sub = _completedWorkoutsProvider.completedWorkoutsStream.listen((state) {
      emit(state);
    });
    emit(_completedWorkoutsProvider.completedWorkouts);
  }


  @override
  Future<void> close() async {
    _sub.cancel();
    super.close();
  }
  
}