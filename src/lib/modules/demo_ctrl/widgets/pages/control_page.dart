import 'dart:js';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/services/treadmill_control_service.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/widgets/controls/unit_quantity_card.dart';

class ControlPage extends StatelessWidget {
  final TreadmillControlService treadmillControlService;

  const ControlPage(this.treadmillControlService, {Key? key}) : super(key: key);

//TODO finish implementing bloc
  Widget build(BuildContext context) {
    return BlocBuilder<TreadmillControlService, TreadmillState>(builder: (ctx, state) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Row(
            children: [UnitQuantityCard(ctx, "s"), UnitQuantityCard(0, "km")],
          ),
          const Row(
            children: [UnitQuantityCard(0, "kCal"), UnitQuantityCard(0, "steps")],
          ),
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
    });
  }
}

class TreadmillState {}
