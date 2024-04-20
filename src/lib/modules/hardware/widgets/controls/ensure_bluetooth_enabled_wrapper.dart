import 'package:flutter/cupertino.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:open_eqi_sports/modules/hardware/widgets/cubits/bluetooth_enablement_cubit.dart';

class EnsureBluetoothEnabledWrapper extends StatelessWidget {
  final Widget Function() onEnabled;

  const EnsureBluetoothEnabledWrapper(this.onEnabled, {super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider<BluetoothEnablementCubit>(
      create: (ctx) => BluetoothEnablementCubit(BluetoothAdapterState.off),
      child: BlocBuilder<BluetoothEnablementCubit, BluetoothAdapterState>(
        builder: (ctx, state) {
          if (state == BluetoothAdapterState.on) {
            return onEnabled();
          }
          return const Text("Turn your bluetooth on");
        },
      ),
    );
  }
}
