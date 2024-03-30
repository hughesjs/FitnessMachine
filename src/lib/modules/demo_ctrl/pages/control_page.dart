import 'package:flutter/material.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/treadmill_ctrl/treadmill_control_service.dart';

class ControlPage extends StatelessWidget {
  final TreadmillControlService treadmillControlService;

  const ControlPage(this.treadmillControlService, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
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
