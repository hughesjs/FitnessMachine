import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_discovery_service.dart';
import 'package:open_eqi_sports/modules/hardware/widgets/models/device_descriptor.dart';

class FitnessMachineCubit extends Cubit<List<DeviceDescriptor>> {
  final FitnessMachineDiscoveryService _fitnessMachineDiscoveryService;

  FitnessMachineCubit()
      : _fitnessMachineDiscoveryService = GetIt.I<FitnessMachineDiscoveryService>(),
        super([]) {
    _fitnessMachineDiscoveryService.deviceStream
        .listen((devices) => emit(devices.map((e) => DeviceDescriptor(e.platformName, e.remoteId.str)).toList()));
    _fitnessMachineDiscoveryService.start();
  }

  void selectDevice(DeviceDescriptor device) {
    print("Selecting device ${device.name}");
  }
}
