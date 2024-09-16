import 'package:fitness_machine/workout_management/models/workout_state.dart';
import 'package:fitness_machine/workout_management/services/workout_state_manager.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';

class TreadmillControls extends StatefulWidget {
  final WorkoutStateManager _workoutStateManager;

  TreadmillControls({super.key})
      : _workoutStateManager = GetIt.I<WorkoutStateManager>();

  @override
  TreadmillControlsState createState() => TreadmillControlsState();
}

class TreadmillControlsState extends State<TreadmillControls> {
  late WorkoutState _currentWorkoutState;

  @override
  void initState() {
    super.initState();
    _currentWorkoutState = widget._workoutStateManager.currentWorkoutState;

    // Listen for changes in the workout state stream
    widget._workoutStateManager.workoutStateStream
        .cast<WorkoutState>()
        .listen((WorkoutState state) {
      setState(() {
        _currentWorkoutState = state;
      });
    });
  }

  void _startOrPauseWorkout() {
    if (_currentWorkoutState == WorkoutState.idle) {
      widget._workoutStateManager.startWorkout();
    } else if (_currentWorkoutState == WorkoutState.paused) {
      widget._workoutStateManager.resumeWorkout();
    } else if (_currentWorkoutState == WorkoutState.running) {
      widget._workoutStateManager.pauseWorkout();
    }
  }

  void _stopWorkout() {
    if (_currentWorkoutState != WorkoutState.idle) {
      widget._workoutStateManager.stopWorkout();
    }
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Expanded(
      child: Card(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: _startOrPauseWorkout,
              style: ElevatedButton.styleFrom(
                shape: const CircleBorder(),
                padding: const EdgeInsets.all(20),
                backgroundColor: colorScheme.primary,
              ),
              child: Icon(
                _currentWorkoutState == WorkoutState.idle
                    ? Icons.play_arrow
                    : (_currentWorkoutState == WorkoutState.paused
                        ? Icons.play_arrow_outlined
                        : Icons.pause),
                color: colorScheme.onPrimary,
                size: 40,
              ),
            ),
            const SizedBox(width: 20),
            ElevatedButton(
              onPressed: _currentWorkoutState != WorkoutState.idle
                  ? _stopWorkout
                  : null,
              style: ElevatedButton.styleFrom(
                shape: const CircleBorder(),
                padding: const EdgeInsets.all(20),
                backgroundColor: _currentWorkoutState != WorkoutState.idle
                    ? colorScheme.secondary
                    : colorScheme.secondary.withOpacity(0.5),
              ),
              child: Icon(
                Icons.stop,
                color: colorScheme.onSecondary,
                size: 40,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
