import 'dart:typed_data';

import 'package:equatable/equatable.dart';

class WorkoutStatus extends Equatable {
  final double speedInKmh;
  final double distanceInKm;
  final int timeInSeconds;
  final int indicatedCalories;
  final int steps;

  const WorkoutStatus({
    required this.speedInKmh,
    required this.distanceInKm,
    required this.timeInSeconds,
    required this.indicatedCalories,
    required this.steps,
  });

  factory WorkoutStatus.zero() {
    return const WorkoutStatus(
      speedInKmh: 0,
      distanceInKm: 0,
      timeInSeconds: 0,
      indicatedCalories: 0,
      steps: 0,
    );
  }

  factory WorkoutStatus.fromBytes(List<int> value) {
    Uint8List status = Uint8List.fromList(value);
    ByteData statusBytes = status.buffer.asByteData();

    var speed = statusBytes.getUint16(2, Endian.little) / 100;
    var distance = statusBytes.getUint16(4, Endian.little) / 1000;
    var time = statusBytes.getUint16(12, Endian.little);
    var steps = statusBytes.getUint16(14, Endian.little);
    var calories = statusBytes.getUint16(7, Endian.little);

    return WorkoutStatus(
      speedInKmh: speed,
      distanceInKm: distance,
      timeInSeconds: time,
      indicatedCalories: calories,
      steps: steps,
    );
  }

  WorkoutStatus copyWith({
    double? speedInKmh,
    double? distanceInKm,
    int? timeInSeconds,
    int? indicatedCalories,
    int? steps,
  }) {
    return WorkoutStatus(
      speedInKmh: speedInKmh ?? this.speedInKmh,
      distanceInKm: distanceInKm ?? this.distanceInKm,
      timeInSeconds: timeInSeconds ?? this.timeInSeconds,
      indicatedCalories: indicatedCalories ?? this.indicatedCalories,
      steps: steps ?? this.steps,
    );
  }

  @override
  List<Object?> get props => [speedInKmh, distanceInKm, timeInSeconds, indicatedCalories, steps];
}
