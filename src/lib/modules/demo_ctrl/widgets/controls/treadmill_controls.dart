import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/services/models/treadmill_state.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/widgets/cubits/treadmill_state_cubit.dart';

class TreadmillControls extends StatelessWidget {
  const TreadmillControls({super.key});

  @override
  Widget build(BuildContext context) {
    final controlCubit = BlocProvider.of<TreadmillStateCubit>(context);
    return BlocBuilder<TreadmillStateCubit, TreadmillState>(builder: (ctx, state) {
      return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        Text("Connection: ${state.connectionState.name}"),
        Text("Speed ${state.speedState.name} (${state.currentSpeed}/${state.requestedSpeed})"),
        ElevatedButton(
          onPressed: () {
            controlCubit.connect();
          },
          child: const Text('Connect'),
        ),
        ElevatedButton(
          onPressed: () {
            controlCubit.start();
          },
          child: const Text('Start'),
        ),
        ElevatedButton(
          onPressed: () {
            controlCubit.stop();
          },
          child: const Text('Stop'),
        ),
        ElevatedButton(
          onPressed: () {
            controlCubit.speedUp();
          },
          child: const Text('Speed Up'),
        ),
        ElevatedButton(
          onPressed: () {
            controlCubit.speedDown();
          },
          child: const Text('Speed Down'),
        ),
      ]);
    });
  }
}
