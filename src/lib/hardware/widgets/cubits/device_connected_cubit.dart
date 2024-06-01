import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:fitness_machine/hardware/services/fitness_machine_provider.dart';


class DeviceConnectedCubit extends Cubit<bool> {
  final FitnessMachineProvider _fitnessMachineProvider;
  late StreamSubscription _sub;

  bool autoOpenedScreen = false;

  DeviceConnectedCubit(super.itialState) : _fitnessMachineProvider = GetIt.I<FitnessMachineProvider>() {
    _sub = _fitnessMachineProvider.currentMachineStream.listen((currentMachine) {
      emit(currentMachine != null);
    });
    emit(_fitnessMachineProvider.currentMachine != null);
  }

  @override
  Future<void> close() async {
    _sub.cancel();
    super.close();
  }
}
