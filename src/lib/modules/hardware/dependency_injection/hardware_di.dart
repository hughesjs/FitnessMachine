import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_command_dispatcher.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_provider.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_query_dispatcher.dart';
import 'package:open_eqi_sports/modules/hardware/widgets/pages/device_selection_screen.dart';

extension DependencyInjectionExtensions on GetIt {
  Future<void> addHardware() async {
    // Use SafeDevice if we need to inject fakes for simulator
    WidgetsFlutterBinding.ensureInitialized();

    registerSingleton<FitnessMachineProvider>(FitnessMachineProvider());
    registerSingleton<FitnessMachineCommandDispatcher>((FitnessMachineCommandDispatcher()));
    registerSingleton<FitnessMachineQueryDispatcher>((FitnessMachineQueryDispatcher()));
    registerSingleton<DeviceSelectionScreen>(const DeviceSelectionScreen());
  }
}
