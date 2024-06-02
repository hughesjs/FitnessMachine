import 'package:fitness_machine/hardware/ble/models/treadmill_data.dart';

class CompletedWorkout {
  final double distanceInKm;
  final int totalSteps;
  final int workoutTimeInSeconds;
  final double machineIndicatedCalories;
  final double calculatedCalories;
  final DateTime startedAt;
  final DateTime completedAt;

  CompletedWorkout(this.distanceInKm, this.totalSteps, this.workoutTimeInSeconds, this.machineIndicatedCalories, this.calculatedCalories,
      this.startedAt, this.completedAt);

  factory CompletedWorkout.fromTreadmillData(TreadmillData data, DateTime start, DateTime end) {
    double calculatedCalories = _calculateCalories(data);
    return CompletedWorkout(data.distanceInKm, data.steps, data.timeInSeconds, data.indicatedKiloCalories.toDouble(), calculatedCalories, start, end);
  }

  // This doesn't belong here. This also assumes average weight and height.
  // Replace this with userdata when we have it.
  static double _calculateCalories(TreadmillData data) {
    const weightInKilos = 80;
    const heightInMeters = 1.8;
    const a = 0.035;
    const b = 0.029;

    final distanceInMeters = data.distanceInKm * 1000;
    final speedInMs = distanceInMeters / data.timeInSeconds;

    final caloriesBurned = distanceInMeters * ((weightInKilos * a) + ((speedInMs * speedInMs) / heightInMeters) * b * weightInKilos);

    return caloriesBurned;
  }
}
