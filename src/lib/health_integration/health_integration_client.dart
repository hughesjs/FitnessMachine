import 'dart:async';

import 'package:fitness_machine/workout_management/models/completed_workout.dart';
import 'package:fitness_machine/workout_management/services/workout_state_manager.dart';
import 'package:get_it/get_it.dart';
import 'package:health/health.dart';
import 'package:logger/logger.dart';

class HealthIntegrationClient {

  final Logger _logger;
  final WorkoutStateManager _workoutStateManager;

  HealthIntegrationClient(): _logger = GetIt.I<Logger>(), _workoutStateManager = GetIt.I<WorkoutStateManager>() {
    _workoutStateManager.workoutCompletedStream.listen((c) async => submitWorkoutData(c));
  }

  Future<void> submitWorkoutData(CompletedWorkout completedWorkout) async {
    
    _logger.i("Submitting workout data to Health");

    bool workoutSuccess = await Health().writeWorkoutData(
      activityType: HealthWorkoutActivityType.WALKING,
      start: completedWorkout.startedAt,
      end: completedWorkout.completedAt,
      totalEnergyBurned: completedWorkout.calculatedCalories.toInt(),
      totalEnergyBurnedUnit: HealthDataUnit.SMALL_CALORIE,
      totalDistance: (completedWorkout.distanceInKm * 1000).toInt(),
      totalDistanceUnit: HealthDataUnit.METER,
      title: "Treadmill Workout on ${completedWorkout.startedAt.toIso8601String()}",
    );

    bool stepsSuccess = await Health().writeHealthData(
      type: HealthDataType.STEPS,
      value: completedWorkout.totalSteps.toDouble(),
      startTime: completedWorkout.startedAt,
      endTime: completedWorkout.completedAt,
    );

    if (!(workoutSuccess && stepsSuccess)) {
      _logger.e("Failed to submit workout data to Health");
    }
  }
}
