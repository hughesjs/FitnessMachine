import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_command_dispatcher.dart';
import 'package:open_eqi_sports/modules/hardware/widgets/pages/device_selection_screen.dart';

class TreadmillControls extends StatelessWidget {
  final FitnessMachineCommandDispatcher _fitnessMachineCommandDispatcher;

  TreadmillControls({super.key}) : _fitnessMachineCommandDispatcher = GetIt.I<FitnessMachineCommandDispatcher>();

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      ElevatedButton(
        onPressed: () async {
          if (context.mounted) {
            await Navigator.push(context, MaterialPageRoute(builder: (context) => GetIt.I<DeviceSelectionScreen>()));
            await _fitnessMachineCommandDispatcher.takeControl();
          }
        },
        child: const Text('Connect'),
      ),
      ElevatedButton(
        onPressed: () {
          _fitnessMachineCommandDispatcher.start();
        },
        child: const Text('Start'),
      ),
      ElevatedButton(
        onPressed: () {
          _fitnessMachineCommandDispatcher.stop();
        },
        child: const Text('Stop'),
      ),
      ElevatedButton(
        onPressed: () {
          _fitnessMachineCommandDispatcher.start();
        },
        child: const Text('Resume'),
      ),
      ElevatedButton(
        onPressed: () {
          _fitnessMachineCommandDispatcher.stop();
        },
        child: const Text('Pause'),
      ),
    ]);
  }
}
