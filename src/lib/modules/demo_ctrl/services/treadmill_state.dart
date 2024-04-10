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
}

enum SpeedState { increasing, decreasing, steady }

enum ConnectionState { searching, connected, disconnected }
