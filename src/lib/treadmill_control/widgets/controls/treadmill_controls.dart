import 'dart:async';

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
  bool _isCountingDown = false;
  int _countdownValue = 3;
  Timer? _countdownTimer;
  StreamSubscription<WorkoutState>? _workoutStateSubscription;

  @override
  void initState() {
    super.initState();
    _currentWorkoutState = widget._workoutStateManager.currentWorkoutState;

    _workoutStateSubscription = widget._workoutStateManager.workoutStateStream
        .cast<WorkoutState>()
        .listen((WorkoutState state) {
      if (mounted) {
        setState(() {
          _currentWorkoutState = state;
        });
      }
    });
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    _workoutStateSubscription?.cancel();
    super.dispose();
  }

  void _startOrPauseWorkout() {
    if (_currentWorkoutState == WorkoutState.idle) {
      widget._workoutStateManager.startWorkout();
      _startCountdown();
    } else if (_currentWorkoutState == WorkoutState.paused) {
      widget._workoutStateManager.resumeWorkout();
    } else if (_currentWorkoutState == WorkoutState.running) {
      widget._workoutStateManager.pauseWorkout();
    }
  }

  void _startCountdown() {
    setState(() {
      _isCountingDown = true;
      _countdownValue = 3;
    });

    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }

      setState(() {
        if (_countdownValue > 0) {
          _countdownValue--;
        } else {
          timer.cancel();
          setState(() {
            _isCountingDown = false;
            _countdownValue = 3;
          });
        }
      });
    });
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
      child: Stack(
        alignment: Alignment.center,
        children: [
          Positioned.fill(
            child: Card(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton(
                    onPressed: _isCountingDown ? null : _startOrPauseWorkout,
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
                    onPressed: _isCountingDown ||
                            _currentWorkoutState == WorkoutState.idle
                        ? null
                        : _stopWorkout,
                    style: ElevatedButton.styleFrom(
                      shape: const CircleBorder(),
                      padding: const EdgeInsets.all(20),
                      backgroundColor: _isCountingDown ||
                              _currentWorkoutState == WorkoutState.idle
                          ? colorScheme.secondary.withOpacity(0.5)
                          : colorScheme.secondary,
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
          ),
          if (_isCountingDown)
            Positioned.fill(
              child: Container(
                color: colorScheme.onSurface.withOpacity(0.5),
                alignment: Alignment.center,
                child: Text(
                  _countdownValue == 0
                      ? "Let's go!"
                      : _countdownValue.toString(),
                  style: Theme.of(context).textTheme.displayLarge,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
