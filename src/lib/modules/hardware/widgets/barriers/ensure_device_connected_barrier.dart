import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:logger/logger.dart';
import 'package:open_eqi_sports/modules/hardware/widgets/cubits/device_connected_cubit.dart';
import 'package:open_eqi_sports/modules/hardware/widgets/pages/device_selection_screen.dart';

class EnsureDeviceConnectedBarrier extends StatelessWidget {
  final Widget onEnabled;
  final Logger _logger;

  EnsureDeviceConnectedBarrier(this.onEnabled, {super.key}) : _logger = GetIt.I<Logger>();

  @override
  Widget build(BuildContext context) {
    return BlocProvider<DeviceConnectedCubit>(
      create: (ctx) => DeviceConnectedCubit(false),
      child: BlocBuilder<DeviceConnectedCubit, bool>(
        builder: (ctx, connected) {
          final cubit = ctx.read<DeviceConnectedCubit>();

          if (connected) {
            return onEnabled;
          }

          if (!cubit.autoOpenedScreen) {
            cubit.autoOpenedScreen = true;
            SchedulerBinding.instance.addPostFrameCallback((_) async {
              _logger.i("Device not connected at barrier, opening device selection screen");
              await openDeviceSelectionScreen(context);
            });
          }

          return Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.bluetooth_searching,
                  size: 100,
                  color: Theme.of(context).colorScheme.primary,
                ),
                const SizedBox(height: 20),
                ElevatedButton(
            onPressed: () => openDeviceSelectionScreen(context),
            child: const Text("Connect a device"),
          )
              ],
            ),
          );


        },
      ),
    );
  }

  Future<void> openDeviceSelectionScreen(BuildContext context) async {
    await Navigator.push(context, MaterialPageRoute(builder: (_) => const DeviceSelectionScreen()));
  }
}
