import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';

class BluetoothScanningCubit extends Cubit<bool> {
  late StreamSubscription<bool> _subscription;

  BluetoothScanningCubit() : super(false) {
    _subscription = FlutterBluePlus.isScanning.listen((event) {
      emit(event);
    });
  }

  @override
  Future<void> close() async {
    _subscription.cancel();
    super.close();
  }
}
