import 'package:flutter/material.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/treadmill_ctrl/treadmill_control_service.dart';

class ControlPage extends StatelessWidget {
  final TreadmillControlService treadmillControlService;

  const ControlPage(this.treadmillControlService, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Text(treadmillControlService.Device?.connectionState.toString() ?? 'Disconnected'),
        // Text(treadmillControlService.Device?.advName.toString() ?? 'No device found'),
        // Text(treadmillControlService.Device?.isConnected ?? false ? 'Connected' : 'Disconnected'),
        // Text(treadmillControlService.Device?.disconnectReason.toString() ?? 'No reason'),
        // Text(treadmillControlService.Device?.bondState.toString() ?? 'No bond state'),
        ElevatedButton(
          onPressed: () {
            treadmillControlService.connect();
          },
          child: const Text('Connect'),
        ),
        ElevatedButton(
          onPressed: () {
            treadmillControlService.start();
          },
          child: const Text('Start'),
        ),
        ElevatedButton(
          onPressed: () {
            treadmillControlService.stop();
          },
          child: const Text('Stop'),
        ),
        ElevatedButton(
          onPressed: () {
            treadmillControlService.pause();
          },
          child: const Text('Pause'),
        ),
        ElevatedButton(
          onPressed: () {
            treadmillControlService.speedUp();
          },
          child: const Text('Speed Up'),
        ),
        ElevatedButton(
          onPressed: () {
            treadmillControlService.speedDown();
          },
          child: const Text('Speed Down'),
        ),
      ],
    );
  }
}
