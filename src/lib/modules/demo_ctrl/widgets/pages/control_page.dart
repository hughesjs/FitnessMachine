import 'package:flutter/material.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/services/treadmill_control_service.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/widgets/controls/unit_quantity_card.dart';

class ControlPage extends StatefulWidget {
  final TreadmillControlService treadmillControlService;

  const ControlPage(this.treadmillControlService, {Key? key}) : super(key: key);

  @override
  State<ControlPage> createState() => _ControlPageState();
}

class _ControlPageState extends State<ControlPage> {
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Row(
          children: [UnitQuantityCard(0, "s"), UnitQuantityCard(0, "km")],
        ),
        const Row(
          children: [UnitQuantityCard(0, "kCal"), UnitQuantityCard(0, "steps")],
        ),
        ElevatedButton(
          onPressed: () {
            widget.treadmillControlService.connect();
          },
          child: const Text('Connect'),
        ),
        ElevatedButton(
          onPressed: () {
            widget.treadmillControlService.start();
          },
          child: const Text('Start'),
        ),
        ElevatedButton(
          onPressed: () {
            widget.treadmillControlService.stop();
          },
          child: const Text('Stop'),
        ),
        ElevatedButton(
          onPressed: () {
            widget.treadmillControlService.speedUp();
          },
          child: const Text('Speed Up'),
        ),
        ElevatedButton(
          onPressed: () {
            widget.treadmillControlService.speedDown();
          },
          child: const Text('Speed Down'),
        ),
      ],
    );
  }
}
