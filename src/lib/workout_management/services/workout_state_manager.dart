import 'dart:async';

import 'package:fitness_machine/hardware/ble/models/treadmill_data.dart';
import 'package:fitness_machine/hardware/services/fitness_machine_command_dispatcher.dart';
import 'package:fitness_machine/hardware/services/fitness_machine_query_dispatcher.dart';
import 'package:fitness_machine/workout_management/models/completed_workout.dart';
import 'package:fitness_machine/workout_management/models/workout_state.dart';
import 'package:get_it/get_it.dart';
import 'package:logger/logger.dart';

class WorkoutStateManager {
  Stream get workoutStateStream => _workoutStateStreamController.stream;
  Stream get workoutStartedStream => _workoutStartedStreamController.stream;
  Stream get workoutCompletedStream => _workoutCompletedStreamController.stream;

  WorkoutState currentWorkoutState = WorkoutState.idle;

  final Logger _logger;

  final StreamController<WorkoutState> _workoutStateStreamController;
  final StreamController<void> _workoutStartedStreamController;
  final StreamController<CompletedWorkout> _workoutCompletedStreamController;

  final FitnessMachineQueryDispatcher _fitnessMachineQueryDispatcher;
  final FitnessMachineCommandDispatcher _fitnessMachineCommandDispatcher;

  DateTime? _currentWorkoutStartTime;
  StreamSubscription? _treadmillDataSubscription;
  TreadmillData? _lastReceivedWorkoutData;

  WorkoutStateManager()
      : _workoutStateStreamController =
            StreamController<WorkoutState>.broadcast(),
        _workoutStartedStreamController = StreamController<void>.broadcast(),
        _workoutCompletedStreamController =
            StreamController<CompletedWorkout>.broadcast(),
        _logger = GetIt.I<Logger>(),
        _fitnessMachineQueryDispatcher =
            GetIt.I<FitnessMachineQueryDispatcher>(),
        _fitnessMachineCommandDispatcher =
            GetIt.I<FitnessMachineCommandDispatcher>();

  Future<void> startWorkout() async {
    _currentWorkoutStartTime = DateTime.now();
    _logger.i("Starting workout at $_currentWorkoutStartTime");

    await _fitnessMachineCommandDispatcher.start();
    _listen();

    try {
      await _waitForTreadmillStart().timeout(const Duration(seconds: 5));
      _workoutStartedStreamController.add(null);
    } catch (e) {
      _logger.e("Failed to start treadmill within timeout");
      _setWorkoutState(WorkoutState.idle);
    }
  }

  Future<void> _waitForTreadmillStart() async {
    await for (TreadmillData update
        in _fitnessMachineQueryDispatcher.treadmillDataStream) {
      /**
       * speedInKmh will be set to minimum speed level on startup
       */
      if (update.speedInKmh > 0) {
        _setWorkoutState(WorkoutState.running);
        break;
      }
    }
  }

  void stopWorkout({bool aborted = false}) {
    _fitnessMachineCommandDispatcher.stop();
    _treadmillDataSubscription?.cancel();
    _setWorkoutState(WorkoutState.idle);

    /**
     * timeInSeconds will only start if you start to walk on the pad
     *
     * It is necessary to check that one has really started to workout and
     * therefore a workout should also be saved
     */
    if (_lastReceivedWorkoutData == null ||
        _currentWorkoutStartTime == null ||
        _lastReceivedWorkoutData!.timeInSeconds == 0) {
      _logger.e("Workout completed without data");
      return;
    }

    if (!aborted) {
      final completedTime = DateTime.now();

      CompletedWorkout completedWorkout = CompletedWorkout.fromTreadmillData(
          _lastReceivedWorkoutData!, _currentWorkoutStartTime!, completedTime);
      _logger.i(
          "Completed workout: ${completedWorkout.distanceInKm}km in ${completedWorkout.workoutTimeInSeconds}s");
      _workoutCompletedStreamController.add(completedWorkout);
    }

    _currentWorkoutStartTime = null;
    _lastReceivedWorkoutData = null;
  }

  void pauseWorkout() {
    _fitnessMachineCommandDispatcher.pause();
    _treadmillDataSubscription?.cancel();
    _setWorkoutState(WorkoutState.paused);
  }

  void resumeWorkout() {
    _fitnessMachineCommandDispatcher.resume();
    _listen();
    _setWorkoutState(WorkoutState.running);
  }

  void _setWorkoutState(WorkoutState state) {
    _logger.i("Workout state changed to $state");
    currentWorkoutState = state;
    _workoutStateStreamController.add(state);
  }

  void _listen() {
    _treadmillDataSubscription =
        _fitnessMachineQueryDispatcher.treadmillDataStream.listen((update) {
      _lastReceivedWorkoutData = update;
    });
  }
}
