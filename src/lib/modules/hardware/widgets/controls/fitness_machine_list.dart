import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:open_eqi_sports/modules/hardware/widgets/cubits/fitness_machine_cubit.dart';
import 'package:open_eqi_sports/modules/hardware/widgets/models/device_descriptor.dart';

class FitnessMachineList extends StatelessWidget {
  const FitnessMachineList({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
        create: (context) => FitnessMachineDiscoveryCubit(),
        child: BlocBuilder<FitnessMachineDiscoveryCubit, List<DeviceDescriptor>>(builder: (context, state) {
          final cubit = context.read<FitnessMachineDiscoveryCubit>();
          return ListView.builder(
              itemCount: state.length,
              itemBuilder: (context, index) {
                final selectedDevice = state[index];
                return ListTile(
                    title: Text(selectedDevice.name),
                    subtitle: Text(selectedDevice.address),
                    onTap: () {
                      cubit.selectDevice(state[index]);
                      Navigator.pop(context);
                    });
              });
        }));
  }
}
