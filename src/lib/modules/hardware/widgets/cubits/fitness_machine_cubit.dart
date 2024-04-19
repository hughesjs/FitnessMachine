import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_discovery_service.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_provider.dart';
import 'package:open_eqi_sports/modules/hardware/widgets/models/device_descriptor.dart';

class FitnessMachineDiscoveryCubit extends Cubit<List<DeviceDescriptor>> {
  final FitnessMachineDiscoveryService _fitnessMachineDiscoveryService;
  final FitnessMachineProvider _fitnessMachineProvider;

  FitnessMachineDiscoveryCubit()
      : _fitnessMachineDiscoveryService = GetIt.I<FitnessMachineDiscoveryService>(),
        _fitnessMachineProvider = GetIt.I<FitnessMachineProvider>(),
        super([]) {
    _fitnessMachineDiscoveryService.deviceStream
        .listen((devices) => emit(devices.map((e) => DeviceDescriptor(e, e.platformName, e.remoteId.str)).toList()));
    _fitnessMachineDiscoveryService.start();
  }

  Future<void> selectDevice(DeviceDescriptor device) async {
    await _fitnessMachineProvider.setMachine(device.device);
    if (!_fitnessMachineProvider.isSet) {
      throw Exception("Machine not set");
    } // TODO: Handle this
  }
}
