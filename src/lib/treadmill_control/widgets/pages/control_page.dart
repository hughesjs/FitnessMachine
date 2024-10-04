import 'package:fitness_machine/hardware/widgets/barriers/ensure_bluetooth_enabled_wrapper.dart';
import 'package:fitness_machine/hardware/widgets/barriers/ensure_device_connected_barrier.dart';
import 'package:fitness_machine/treadmill_control/widgets/controls/speed_indicator.dart';
import 'package:fitness_machine/treadmill_control/widgets/controls/treadmill_controls.dart';
import 'package:fitness_machine/treadmill_control/widgets/controls/workout_status_panel.dart';
import 'package:fitness_machine/treadmill_control/widgets/cubits/workout_status_cubit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ControlPage extends StatelessWidget {
  const ControlPage({super.key});

  @override
  Widget build(BuildContext context) {
    return EnsureBluetoothEnabledWrapper(
      EnsureDeviceConnectedBarrier(
        BlocProvider<TrainingStatusCubit>(
          create: (ctx) => TrainingStatusCubit(),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const WorkoutStatusPanel(),
                  const SpeedIndicator(),
                  TreadmillControls(),
                ]),
          ),
        ),
      ),
    );
  }
}
