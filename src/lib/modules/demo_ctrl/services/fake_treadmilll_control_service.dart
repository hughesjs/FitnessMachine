import 'dart:async';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/services/treadmill_control_service.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/services/treadmill_status.dart';

class FakeTreadmillControlService implements TreadmillControlService, Disposable {
  static const double minSpeed = 1;
  static const double maxSpeed = 6;
  static const double _ticksInSeconds = 0.25;
  static int ticks = 0;

  double __requestedSpeed = 0;
  bool _isRunning = false;
  bool _isConnected = false;
  Timer? _tickTimer;
  Timer? _secondTimer;

  WorkoutStatus _innerState;

  double get _requestedSpeed => __requestedSpeed;

  set _requestedSpeed(double value) {
    if (value < minSpeed) {
      value = minSpeed;
    } else if (value > maxSpeed) {
      value = maxSpeed;
    }
    __requestedSpeed = value;
  }

  FakeTreadmillControlService() : _innerState = WorkoutStatus.zero();

  @override
  Future<void> connect() async {
    _isConnected = true;
    _tickTimer = Timer.periodic(Duration(milliseconds: (_ticksInSeconds * 1000).toInt()), _updateState);
    _secondTimer = Timer.periodic(const Duration(seconds: 1), _updateSeconds);
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
      _innerState = WorkoutStatus.zero();
      _isRunning = true;
    }
  }

  @override
  Future<void> stop() async {
    _isRunning = false;
  }

  @override
  FutureOr onDispose() {
    _tickTimer?.cancel();
    _secondTimer?.cancel();
  }

  double _innerCals = 0;

  void _updateState(Timer timer) {
    if (!_isRunning) return;
    final distanceCovered = _requestedSpeed * _ticksInSeconds / 3600; // Units are per hour
    _innerCals += _requestedSpeed * 75 * (_ticksInSeconds / 3600); // Speed as proxy for METs
    _innerState.distanceInKm += distanceCovered;
    _innerState.speedInKmh = _requestedSpeed;

    if (_innerCals > 1) {
      _innerState.indicatedCalories++;
      _innerCals = 0;
    }
  }

  void _updateSeconds(Timer timer) {
    if (!_isRunning) return;
    _innerState.timeInSeconds += 1;
    _innerState.steps += 1;
  }
}
