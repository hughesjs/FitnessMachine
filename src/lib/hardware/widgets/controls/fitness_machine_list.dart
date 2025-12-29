import 'package:fitness_machine/hardware/widgets/barriers/ensure_bluetooth_enabled_wrapper.dart';
import 'package:fitness_machine/hardware/widgets/cubits/fitness_machine_cubit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../cubits/fitness_machine_discovery_state.dart';

class FitnessMachineList extends StatelessWidget {
  const FitnessMachineList({super.key});

  @override
  Widget build(BuildContext context) {
    return EnsureBluetoothEnabledWrapper(
      BlocProvider<FitnessMachineDiscoveryCubit>(
        create: (context) => FitnessMachineDiscoveryCubit(),
        child: BlocListener<FitnessMachineDiscoveryCubit,
            FitnessMachineDiscoveryState>(
          listener: (context, state) {
            if (state.connectedDevice != null) {
              Navigator.pop(context);
            }
          },
          child: BlocBuilder<FitnessMachineDiscoveryCubit,
              FitnessMachineDiscoveryState>(
            builder: (context, state) {
              final cubit = context.read<FitnessMachineDiscoveryCubit>();

              return ListView.builder(
                itemCount: state.devices.length,
                itemBuilder: (context, index) {
                  final device = state.devices[index];
                  final isConnecting = state.connectingDevice == device;
                  final isConnected = state.connectedDevice == device;

                  return ListTile(
                    title: Text(device.name),
                    subtitle: Text(device.address +
                        (isConnecting
                            ? ' (Connecting...)'
                            : (isConnected ? ' (Connected)' : ''))),
                    onTap: () {
                      if (!isConnecting && !isConnected) {
                        cubit.selectDevice(device);
                      }
                    },
                  );
                },
              );
            },
          ),
        ),
      ),
    );
  }
}
