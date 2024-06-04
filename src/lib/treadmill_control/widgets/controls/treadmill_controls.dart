import 'package:fitness_machine/workout_management/services/workout_state_manager.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';


class TreadmillControls extends StatelessWidget {
  final WorkoutStateManager _workoutStateManager;

  TreadmillControls({super.key}) : 
   
    _workoutStateManager = GetIt.I<WorkoutStateManager>();

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      ElevatedButton(
        onPressed: () {
          _workoutStateManager.startWorkout();
        },
        child: const Text('Start'),
      ),
      ElevatedButton(
        onPressed: () {
          _workoutStateManager.stopWorkout();
        },
        child: const Text('Stop'),
      ),
      ElevatedButton(
        onPressed: () {
          _workoutStateManager.resumeWorkout();
        },
        child: const Text('Resume'),
      ),
      ElevatedButton(
        onPressed: () {
          _workoutStateManager.pauseWorkout();

        },
        child: const Text('Pause'),
      ),
    ]);
  }
}
