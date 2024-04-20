import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/models/speed_state.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/widgets/cubits/speed_range_and_setting_cubit.dart';

class SpeedIndicator extends StatelessWidget {
  const SpeedIndicator({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
        create: (ctx) => SpeedRangeAndSettingCubit(const SpeedState.zero()),
        child: BlocBuilder<SpeedRangeAndSettingCubit, SpeedState>(
          builder: (ctx, state) => Row(
            children: [
              Text(state.minSpeed.toStringAsFixed(1)),
              Expanded(child: LinearProgressIndicator(value: state.maxSpeed > 0 ? state.speedInKmh / state.maxSpeed : 0)),
              Text(state.maxSpeed.toStringAsFixed(1)),
            ],
          ),
        ));
  }
}
