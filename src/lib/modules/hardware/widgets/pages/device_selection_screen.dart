import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:open_eqi_sports/modules/hardware/widgets/cubits/fitness_machine_cubit.dart';
import 'package:open_eqi_sports/modules/hardware/widgets/models/device_descriptor.dart';

class DeviceSelectionScreen extends StatelessWidget {
  const DeviceSelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: Scaffold(
            appBar: AppBar(
              title: const Text("Devices"),
              leading: IconButton(
                  icon: const Icon(Icons.arrow_back),
                  onPressed: () {
                    Navigator.pop(context);
                  }),
              actions: const [
                // Maybe tie this to FlutterBluePlus.isScanning
                Padding(padding: EdgeInsets.symmetric(horizontal: 8), child: CircularProgressIndicator(value: null)),
              ],
            ),
            body: BlocProvider(
                create: (context) => FitnessMachineCubit(),
                child: BlocBuilder<FitnessMachineCubit, List<DeviceDescriptor>>(builder: (context, state) {
                  final cubit = context.read<FitnessMachineCubit>();
                  return ListView.builder(
                      itemCount: state.length,
                      itemBuilder: (context, index) {
                        return ListTile(
                          title: Text(state[index].name),
                          subtitle: Text(state[index].address),
                          onTap: () => cubit.selectDevice(state[index]),
                        );
                      });
                }))));
  }
}
