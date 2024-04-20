import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';

class BluetoothEnablementCubit extends Cubit<BluetoothAdapterState> {
  late StreamSubscription _sub;

  BluetoothEnablementCubit(super.initialState) {
    _sub = FlutterBluePlus.adapterState.listen((state) {
      emit(state);
    });
  }

  @override
  Future<void> close() async {
    _sub.cancel();
    super.close();
  }
}
