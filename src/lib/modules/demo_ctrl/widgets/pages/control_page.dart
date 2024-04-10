import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/services/treadmill_control_service.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/services/treadmill_workout_union.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/widgets/controls/unit_quantity_card.dart';

class ControlPage extends StatelessWidget {
  final TreadmillControlService treadmillControlService;
  const ControlPage(this.treadmillControlService, {Key? key}) : super(key: key);

//TODO finish implementing bloc
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (ctx) => treadmillControlService,
      child: BlocBuilder<TreadmillControlService, TreadmillWorkoutUnion>(builder: (ctx, state) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                UnitQuantityCard(state.workoutStatus.timeInSeconds, "s", 0),
                UnitQuantityCard(state.workoutStatus.distanceInKm, "km", 2),
              ],
            ),
            Row(
              children: [
                UnitQuantityCard(state.workoutStatus.indicatedCalories, "kCal", 0),
                UnitQuantityCard(state.workoutStatus.steps, "steps", 0),
              ],
            ),
            Text("Connection: ${state.treadmillState.connectionState.name}"),
            Text(
                "Speed ${state.treadmillState.speedState.name} (${state.treadmillState.currentSpeed}/${state.treadmillState.requestedSpeed})"),
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
      }),
    );
  }
}
