import 'dart:typed_data';

class WorkoutStatus {
  double speedInKmh;
  double distanceInKm;
  int timeInSeconds;
  int indicatedCalories;
  int steps;

  WorkoutStatus({
    required this.speedInKmh,
    required this.distanceInKm,
    required this.timeInSeconds,
    required this.indicatedCalories,
    required this.steps,
  });

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
}
