import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:open_eqi_sports/modules/hardware/widgets/cubits/bluetooth_enablement_cubit.dart';

class EnsureBluetoothEnabledWrapper extends StatelessWidget {
  final Widget onEnabled;

  const EnsureBluetoothEnabledWrapper(this.onEnabled, {super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider<BluetoothEnablementCubit>(
        create: (ctx) => BluetoothEnablementCubit(BluetoothAdapterState.off),
        child: BlocBuilder<BluetoothEnablementCubit, BluetoothAdapterState>(builder: (ctx, state) {
          if (state == BluetoothAdapterState.on) {
            return onEnabled;
          }
          return Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.bluetooth,
                  size: 100,
                  color: Theme.of(context).colorScheme.primary,
                ),
                const SizedBox(height: 20),
                const Text(
                  'Turn On Your Bluetooth',
                  style: TextStyle(fontSize: 20),
                ),
              ],
            ),
          );
        }));
  }
}
