import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/hardware/services/dev_only/fake_treadmilll_control_service.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_discovery_service.dart';
import 'package:open_eqi_sports/modules/hardware/services/treadmill_control_service.dart';
import 'package:open_eqi_sports/modules/hardware/widgets/pages/device_selection_screen.dart';
import 'package:safe_device/safe_device.dart';

extension DependencyInjectionExtensions on GetIt {
  Future<void> addHardware() async {
    WidgetsFlutterBinding.ensureInitialized();
    if (await SafeDevice.isRealDevice) {
      registerSingleton<TreadmillControlService>(TreadmillControlService());
    } else {
      registerSingleton<TreadmillControlService>(FakeTreadmillControlService());
      print("Injecting fake treadmill service");
    }
    registerSingleton<FitnessMachineDiscoveryService>(FitnessMachineDiscoveryService());
    registerSingleton<DeviceSelectionScreen>(const DeviceSelectionScreen());
  }
}
