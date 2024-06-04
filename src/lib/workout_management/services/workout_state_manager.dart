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

  WorkoutStateManager(): _workoutStateStreamController = StreamController<WorkoutState>.broadcast(),
    _workoutStartedStreamController = StreamController<void>.broadcast(),
    _workoutCompletedStreamController = StreamController<CompletedWorkout>.broadcast(),
    _logger = GetIt.I<Logger>(),
    _fitnessMachineQueryDispatcher = GetIt.I<FitnessMachineQueryDispatcher>(),
     _fitnessMachineCommandDispatcher = GetIt.I<FitnessMachineCommandDispatcher>();


  void startWorkout()  {
    _currentWorkoutStartTime = DateTime.now();
    _logger.i("Starting workout at $_currentWorkoutStartTime");
    _fitnessMachineCommandDispatcher.start();
    _listen();
    _setWorkoutState(WorkoutState.running);
    _workoutStartedStreamController.add(null);
  }

  void stopWorkout({bool aborted = false})
  {
    _fitnessMachineCommandDispatcher.stop();
    _treadmillDataSubscription?.cancel();
    _setWorkoutState(WorkoutState.idle);

    if (_lastReceivedWorkoutData == null || _currentWorkoutStartTime == null) {
      _logger.e("Workout completed without data");
      return;
    }
    
    if (!aborted) {
      final completedTime = DateTime.now();
      
      CompletedWorkout completedWorkout = CompletedWorkout.fromTreadmillData(_lastReceivedWorkoutData!, _currentWorkoutStartTime!, completedTime);
      _logger.i("Completed workout: ${completedWorkout.distanceInKm}km in ${completedWorkout.workoutTimeInSeconds}s");
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
    _treadmillDataSubscription = _fitnessMachineQueryDispatcher.treadmillDataStream.listen((update) {
      _lastReceivedWorkoutData = update;
    });
  }
}