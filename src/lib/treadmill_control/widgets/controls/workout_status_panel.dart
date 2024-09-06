import 'package:fitness_machine/hardware/ble/models/treadmill_data.dart';
import 'package:fitness_machine/treadmill_control/widgets/controls/duration_card.dart';
import 'package:fitness_machine/treadmill_control/widgets/controls/unit_quantity_card.dart';
import 'package:fitness_machine/treadmill_control/widgets/cubits/workout_status_cubit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class WorkoutStatusPanel extends StatelessWidget {
  const WorkoutStatusPanel({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<TrainingStatusCubit, TreadmillData>(
        builder: (ctx, state) {
      return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        Row(
          children: [
            DurationCard(state.timeInSeconds),
          ],
        ),
        Row(
          children: [
            UnitQuantityCard(state.distanceInKm, "km", 2),
            UnitQuantityCard(state.indicatedKiloCalories, "kCal", 0),
          ],
        ),
        Row(
          children: [
            UnitQuantityCard(state.steps, "steps", 0),
          ],
        )
      ]);
    });
  }
}
