class TreadmillState {
  SpeedState speedState;
  ConnectionState connectionState;
  double requestedSpeed;
  double currentSpeed;

  TreadmillState({
    required this.speedState,
    required this.connectionState,
    required this.requestedSpeed,
    required this.currentSpeed,
  });

  static TreadmillState initial() {
    return TreadmillState(
      speedState: SpeedState.steady,
      connectionState: ConnectionState.disconnected,
      requestedSpeed: 0,
      currentSpeed: 0,
    );
  }

  TreadmillState copyWith({
    SpeedState? speedState,
    ConnectionState? connectionState,
    double? requestedSpeed,
    double? currentSpeed,
  }) {
    return TreadmillState(
      speedState: speedState ?? this.speedState,
      connectionState: connectionState ?? this.connectionState,
      requestedSpeed: requestedSpeed ?? this.requestedSpeed,
      currentSpeed: currentSpeed ?? this.currentSpeed,
    );
  }
}

enum SpeedState { increasing, decreasing, steady }

enum ConnectionState { searching, connected, disconnected }
