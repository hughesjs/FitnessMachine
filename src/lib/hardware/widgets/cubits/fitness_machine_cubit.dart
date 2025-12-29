import 'dart:async';

import 'package:fitness_machine/hardware/ble/constants/known_services.dart';
import 'package:fitness_machine/hardware/services/fitness_machine_provider.dart';
import 'package:fitness_machine/hardware/widgets/models/device_descriptor.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:get_it/get_it.dart';

import 'fitness_machine_discovery_state.dart';

class FitnessMachineDiscoveryCubit extends Cubit<FitnessMachineDiscoveryState> {
  final FitnessMachineProvider _fitnessMachineProvider;
  StreamSubscription? _discoSub;

  FitnessMachineDiscoveryCubit()
      : _fitnessMachineProvider = GetIt.I<FitnessMachineProvider>(),
        super(FitnessMachineDiscoveryState(devices: [])) {
    startScanning();
  }

  Future<void> startScanning() async {
    _discoSub = FlutterBluePlus.onScanResults.listen((results) async {
      if (results.isNotEmpty) {
        onDevicesFound(results.map((e) => e.device).toList());
      }
    });

    FlutterBluePlus.cancelWhenScanComplete(_discoSub!);
    await FlutterBluePlus.startScan(
        withServices: [KnownServices.fitnessMachine],
        timeout: const Duration(seconds: 15));
  }

  void onDevicesFound(List<BluetoothDevice> devices) {
    emit(state.copyWith(
        devices: devices
            .map((e) => DeviceDescriptor(e, e.platformName, e.remoteId.str))
            .toList()));
  }

  Future<void> selectDevice(DeviceDescriptor device) async {
    emit(state.copyWith(connectingDevice: device));

    try {
      await _fitnessMachineProvider.setMachine(device.device);
      emit(state.copyWith(connectedDevice: device, connectingDevice: null));
    } catch (e) {
      emit(state.copyWith(connectingDevice: null));
    }
  }

  @override
  Future<void> close() async {
    _discoSub?.cancel();
    super.close();
  }
}
