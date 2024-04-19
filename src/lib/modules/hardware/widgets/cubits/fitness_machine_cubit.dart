import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_discovery_service.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_provider.dart';
import 'package:open_eqi_sports/modules/hardware/widgets/models/device_descriptor.dart';

class FitnessMachineDiscoveryCubit extends Cubit<List<DeviceDescriptor>> {
  final FitnessMachineDiscoveryService _fitnessMachineDiscoveryService;
  final FitnessMachineProvider _fitnessMachineProvider;
  late StreamSubscription _discoSub;

  FitnessMachineDiscoveryCubit()
      : _fitnessMachineDiscoveryService = GetIt.I<FitnessMachineDiscoveryService>(),
        _fitnessMachineProvider = GetIt.I<FitnessMachineProvider>(),
        super([]) {
    _discoSub = _fitnessMachineDiscoveryService.deviceStream.listen((devices) => onDevicesFound(devices));
    _fitnessMachineDiscoveryService.start();
  }

  void onDevicesFound(List<BluetoothDevice> devices) =>
      emit(devices.map((e) => DeviceDescriptor(e, e.platformName, e.remoteId.str)).toList());

  Future<void> selectDevice(DeviceDescriptor device) async {
    await _fitnessMachineProvider.setMachine(device.device);
  }

  @override
  Future<void> close() async {
    _discoSub.cancel();
    super.close();
  }
}
