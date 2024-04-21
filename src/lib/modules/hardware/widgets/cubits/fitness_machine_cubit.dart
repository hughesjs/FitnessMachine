import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:get_it/get_it.dart';
import 'package:fitness_machine/modules/hardware/bt/constants/known_services.dart';
import 'package:fitness_machine/modules/hardware/services/fitness_machine_provider.dart';
import 'package:fitness_machine/modules/hardware/widgets/models/device_descriptor.dart';

class FitnessMachineDiscoveryCubit extends Cubit<List<DeviceDescriptor>> {
  final FitnessMachineProvider _fitnessMachineProvider;
  StreamSubscription? _discoSub;

  FitnessMachineDiscoveryCubit()
      : _fitnessMachineProvider = GetIt.I<FitnessMachineProvider>(),
        super([]) {
    startScanning();
  }

  Future<void> startScanning() async {
    _discoSub = FlutterBluePlus.onScanResults.listen((results) async {
      if (results.isNotEmpty) {
        onDevicesFound(results.map((e) => e.device).toList());
      }
    });

    FlutterBluePlus.cancelWhenScanComplete(_discoSub!);
    await FlutterBluePlus.startScan(withServices: [KnownServices.fitnessMachine], timeout: const Duration(seconds: 15));
  }

  void onDevicesFound(List<BluetoothDevice> devices) =>
      emit(devices.map((e) => DeviceDescriptor(e, e.platformName, e.remoteId.str)).toList());

  Future<void> selectDevice(DeviceDescriptor device) async {
    await _fitnessMachineProvider.setMachine(device.device);
  }

  @override
  Future<void> close() async {
    _discoSub?.cancel();
    super.close();
  }
}
