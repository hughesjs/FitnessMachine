import 'package:fitness_machine/workout_management/models/completed_workout.dart';
import 'package:health/health.dart';

class HealthIntegrationClient {
  HealthIntegrationClient();

  Future<void> submitWorkoutData(CompletedWorkout completedWorkout) async {
    
    var types = [
      HealthDataType.STEPS,
      HealthDataType.DISTANCE_WALKING_RUNNING,
      HealthDataType.TOTAL_CALORIES_BURNED,
      HealthDataType.WORKOUT
    ];
    
    var permissions = [HealthDataAccess.READ_WRITE];
    await Health().requestAuthorization(types, permissions: permissions);

    await Health().writeWorkoutData(
      activityType: HealthWorkoutActivityType.WALKING,
      start: completedWorkout.startedAt,
      end: completedWorkout.completedAt,
      totalEnergyBurned: completedWorkout.calculatedCalories.toInt(),
      totalEnergyBurnedUnit: HealthDataUnit.SMALL_CALORIE,
      totalDistance: (completedWorkout.distanceInKm * 1000).toInt(),
      totalDistanceUnit: HealthDataUnit.METER,
      title: "Treadmill Workout on ${completedWorkout.startedAt.toIso8601String()}",
    );

    await Health().writeHealthData(
      type: HealthDataType.STEPS,
      value: completedWorkout.totalSteps.toDouble(),
      startTime: completedWorkout.startedAt,
      endTime: completedWorkout.completedAt,
    );
  }
}
