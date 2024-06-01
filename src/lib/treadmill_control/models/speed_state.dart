import 'package:equatable/equatable.dart';

class SpeedState extends Equatable {
  final double speedInKmh;
  final double minSpeed;
  final double maxSpeed;

  const SpeedState(this.speedInKmh, this.minSpeed, this.maxSpeed);

  @override
  List<Object?> get props => [speedInKmh, minSpeed, maxSpeed];

  const SpeedState.zero() : this(0, 0, 0);

  SpeedState copyWith({double? speedInKmh, double? minSpeed, double? maxSpeed}) {
    return SpeedState(speedInKmh ?? this.speedInKmh, minSpeed ?? this.minSpeed, maxSpeed ?? this.maxSpeed);
  }
}
