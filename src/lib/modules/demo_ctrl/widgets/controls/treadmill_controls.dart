import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/hardware/services/treadmill_control_service.dart';
import 'package:open_eqi_sports/modules/hardware/widgets/pages/device_selection_screen.dart';

class TreadmillControls extends StatelessWidget {
  final TreadmillControlService _treadmillControllService;

  TreadmillControls({super.key}) : _treadmillControllService = GetIt.I<TreadmillControlService>();

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      ElevatedButton(
        onPressed: () async {
          if (context.mounted) {
            await Navigator.push(context, MaterialPageRoute(builder: (context) => GetIt.I<DeviceSelectionScreen>()));
            await _treadmillControllService.takeControl();
          }
        },
        child: const Text('Connect'),
      ),
      ElevatedButton(
        onPressed: () {
          _treadmillControllService.start();
        },
        child: const Text('Start'),
      ),
      ElevatedButton(
        onPressed: () {
          _treadmillControllService.stop();
        },
        child: const Text('Stop'),
      ),
      ElevatedButton(
        onPressed: () {
          _treadmillControllService.start();
        },
        child: const Text('Resume'),
      ),
      ElevatedButton(
        onPressed: () {
          _treadmillControllService.stop();
        },
        child: const Text('Pause'),
      ),
      ElevatedButton(
        onPressed: () {
          _treadmillControllService.speedUp();
        },
        child: const Text('Speed Up'),
      ),
      ElevatedButton(
        onPressed: () {
          _treadmillControllService.speedDown();
        },
        child: const Text('Speed Down'),
      ),
    ]);
  }
}
