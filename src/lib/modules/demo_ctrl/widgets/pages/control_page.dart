import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/widgets/controls/speed_indicator.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/widgets/controls/treadmill_controls.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/widgets/controls/workout_status_panel.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/widgets/cubits/workout_status_cubit.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_query_dispatcher.dart';
import 'package:open_eqi_sports/modules/hardware/widgets/pages/device_selection_screen.dart';

class ControlPage extends StatelessWidget {
  final FitnessMachineQueryDispatcher _fitnessMachineQueryDispatcher;
  final DeviceSelectionScreen _deviceSelectionScreen;
  ControlPage({Key? key})
      : _fitnessMachineQueryDispatcher = GetIt.I<FitnessMachineQueryDispatcher>(),
        _deviceSelectionScreen = GetIt.I<DeviceSelectionScreen>(),
        super(key: key);

  @override
  Widget build(BuildContext context) {
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      if (context.mounted && !_fitnessMachineQueryDispatcher.isConnected) {
        Navigator.push(context, MaterialPageRoute(builder: (_) => _deviceSelectionScreen));
      }
    });
    return BlocProvider<TrainingStatusCubit>(
      create: (ctx) => TrainingStatusCubit(),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        const WorkoutStatusPanel(),
        const SpeedIndicator(),
        TreadmillControls(),
      ]),
    );
  }
}
