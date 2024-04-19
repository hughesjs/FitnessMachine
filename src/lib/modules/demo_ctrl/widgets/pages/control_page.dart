import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/widgets/controls/treadmill_controls.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/widgets/controls/workout_status_panel.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/widgets/cubits/treadmill_state_cubit.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/widgets/cubits/workout_status_cubit.dart';

class ControlPage extends StatelessWidget {
  const ControlPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<WorkoutStatusCubit>(
          create: (ctx) => WorkoutStatusCubit(),
        ),
        BlocProvider<TreadmillStateCubit>(
          create: (ctx) => TreadmillStateCubit(),
        ),
      ],
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          WorkoutStatusPanel(),
          TreadmillControls(),
        ],
      ),
    );
  }
}
