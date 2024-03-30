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
    Uint16List status = Uint16List.fromList(value);
    print("uint16: ${status.map((e) => e.toRadixString(16)).join(" ")}");

    ByteData speedBuffer = ByteData(2)
      ..setUint8(0, status[2])
      ..setUint8(1, status[3]);

    var speed = speedBuffer.getUint16(0, Endian.little) / 100;

    print("${_byteDataAsHex(speedBuffer)} -> $speed km/h");

    ByteData distanceBuffer = ByteData(2)
      ..setUint8(0, status[4])
      ..setUint8(1, status[5]);
    var distance = distanceBuffer.getUint16(0, Endian.little) / 100;

    ByteData timeBuffer = ByteData(2)
      ..setUint8(0, status[12])
      ..setUint8(1, status[13]);
    var time = timeBuffer.getUint16(0, Endian.little);

    ByteData stepsBuffer = ByteData(2)
      ..setUint8(0, status[14])
      ..setUint8(1, status[15]);
    var steps = stepsBuffer.getUint16(0, Endian.little);

    ByteData caloriesBuffer = ByteData(2)
      ..setUint8(0, status[6])
      ..setUint8(1, status[7]);
    var calories = caloriesBuffer.getUint16(0, Endian.big);

    return WorkoutStatus(
      speedInKmh: speed,
      distanceInKm: distance,
      timeInSeconds: time,
      indicatedCalories: calories,
      steps: steps,
    );
  }

  static String _byteDataAsHex(ByteData byteData) {
    List<int> bytes = byteData.buffer.asUint8List();
    return bytes.map((byte) => byte.toRadixString(16).padLeft(2, '0')).join(' ');
  }

  void prettyPrint() {
    print('Speed: $speedInKmh km/h');
    print('Distance: $distanceInKm km');
    print('Time: $timeInSeconds seconds');
    print('Calories: $indicatedCalories kcal');
    print('Steps: $steps');
  }
}
