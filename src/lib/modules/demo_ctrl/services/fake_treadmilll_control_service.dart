import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/services/treadmill_control_service.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/services/treadmill_state.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/services/treadmill_workout_union.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/services/workout_status.dart';

class FakeTreadmillControlService extends Cubit<TreadmillWorkoutUnion> implements TreadmillControlService, Disposable {
  static const double minSpeed = 1;
  static const double maxSpeed = 6;
  static const double _ticksInSeconds = 0.25;
  static int ticks = 0;

  double __requestedSpeed = 0;

  double _actualSpeed = 0;
  double _innerCals = 0;
  double _fractionsOfSteps = 0;

  bool _isRunning = false;
  bool _isConnected = false;

  Timer? _tickTimer;
  Timer? _secondTimer;
  Timer? _speedTimer;

  WorkoutStatus _innerWorkoutState;

  double get _requestedSpeed => __requestedSpeed;

  set _requestedSpeed(double value) {
    if (value < minSpeed && _isRunning) {
      value = minSpeed;
    } else if (value > maxSpeed) {
      value = maxSpeed;
    }
    __requestedSpeed = value;
  }

  FakeTreadmillControlService(super.initialState) : _innerWorkoutState = WorkoutStatus.zero();

  @override
  Future<void> connect() async {
    _isConnected = true;
    _tickTimer = Timer.periodic(Duration(milliseconds: (_ticksInSeconds * 1000).toInt()), _updateState);
    _secondTimer = Timer.periodic(const Duration(seconds: 1), _updateSeconds);
    _speedTimer = Timer.periodic(Duration(milliseconds: (_ticksInSeconds * 1000).toInt()), (_) => _updateSpeed());
  }

  @override
  void pause() {}

  @override
  Future<void> speedDown() async {
    _requestedSpeed -= 0.5;
  }

  @override
  Future<void> speedUp() async {
    _requestedSpeed += 0.5;
  }

  @override
  Future<void> start() async {
    if (_isConnected) {
      _innerWorkoutState = WorkoutStatus.zero();
      _isRunning = true;
    }
  }

  @override
  Future<void> stop() async {
    _isRunning = false;
    _requestedSpeed = 0;
  }

  @override
  FutureOr onDispose() {
    _tickTimer?.cancel();
    _secondTimer?.cancel();
    _speedTimer?.cancel();
  }

  void _updateState(Timer timer) {
    if (!_isRunning && _actualSpeed == 0) return;
    final distanceCovered = _requestedSpeed * _ticksInSeconds / 3600; // Units are per hour
    _innerCals += _requestedSpeed * 75 * (_ticksInSeconds / 3600); // Speed as proxy for METs
    _innerWorkoutState.distanceInKm += distanceCovered;
    _innerWorkoutState.speedInKmh = _actualSpeed;

    int cadence = 0;

    if (_requestedSpeed > 0 && __requestedSpeed < 2) {
      cadence = 40;
    } else if (_requestedSpeed >= 2 && __requestedSpeed < 4) {
      cadence = 90;
    } else if (_requestedSpeed >= 4 && __requestedSpeed <= 6) {
      cadence = 120;
    }

    _fractionsOfSteps += cadence * _ticksInSeconds / 60;

    if (_fractionsOfSteps >= 1) {
      _innerWorkoutState.steps += _fractionsOfSteps.round();
      _fractionsOfSteps = 0;
    }

    if (_innerCals > 1) {
      _innerWorkoutState.indicatedCalories++;
      _innerCals = 0;
    }
    emit(TreadmillWorkoutUnion(
        TreadmillState(
          connectionState: _isConnected ? ConnectionState.connected : ConnectionState.disconnected,
          currentSpeed: _innerWorkoutState.speedInKmh,
          requestedSpeed: _requestedSpeed,
          speedState: _innerWorkoutState.speedInKmh == _requestedSpeed
              ? SpeedState.steady
              : _innerWorkoutState.speedInKmh < _requestedSpeed
                  ? SpeedState.increasing
                  : SpeedState.decreasing,
        ),
        _innerWorkoutState));
  }

  void _updateSeconds(Timer timer) {
    if (!_isRunning || _requestedSpeed == 0) return;
    _innerWorkoutState.timeInSeconds += 1;
  }

  void _updateSpeed() {
    if (_actualSpeed < _requestedSpeed) {
      _actualSpeed += 0.1;
    } else if (_actualSpeed > _requestedSpeed) {
      _actualSpeed -= 0.1;
    }

    if ((_actualSpeed - _requestedSpeed).abs() < 0.11) {
      _actualSpeed = _requestedSpeed;
    }
  }
}
