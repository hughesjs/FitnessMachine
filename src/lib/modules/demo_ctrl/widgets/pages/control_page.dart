import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/widgets/controls/speed_indicator.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/widgets/controls/treadmill_controls.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/widgets/controls/workout_status_panel.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/widgets/cubits/workout_status_cubit.dart';
import 'package:open_eqi_sports/modules/hardware/widgets/barriers/ensure_bluetooth_enabled_wrapper.dart';
import 'package:open_eqi_sports/modules/hardware/widgets/barriers/ensure_device_connected_barrier.dart';

class ControlPage extends StatelessWidget {
  const ControlPage({super.key});

  @override
  Widget build(BuildContext context) {
    return EnsureBluetoothEnabledWrapper(
      EnsureDeviceConnectedBarrier(
       BlocProvider<TrainingStatusCubit>(
        create: (ctx) => TrainingStatusCubit(),
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          const WorkoutStatusPanel(),
          const SpeedIndicator(),
          TreadmillControls(),
        ]),
      )) );
    }
}
