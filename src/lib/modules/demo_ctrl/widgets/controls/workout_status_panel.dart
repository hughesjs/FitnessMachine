import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/models/workout_status.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/widgets/controls/unit_quantity_card.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/widgets/cubits/workout_status_cubit.dart';

class WorkoutStatusPanel extends StatelessWidget {
  const WorkoutStatusPanel({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<TrainingStatusCubit, TreadmillData>(builder: (ctx, state) {
      return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        Row(
          children: [
            UnitQuantityCard(state.timeInSeconds, "s", 0),
            UnitQuantityCard(state.distanceInKm, "km", 2),
          ],
        ),
        Row(
          children: [
            UnitQuantityCard(state.indicatedCalories, "kCal", 0),
            UnitQuantityCard(state.steps, "steps", 0),
          ],
        )
      ]);
    });
  }
}
