import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:open_eqi_sports/modules/hardware/widgets/cubits/bluetooth_scanning_cubit.dart';

class BluetoothScanningIndicator extends StatelessWidget {
  const BluetoothScanningIndicator({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
        create: (ctx) => BluetoothScanningCubit(),
        child: BlocBuilder<BluetoothScanningCubit, bool>(
            builder: (ctx, state) => state
                ? const Padding(padding: EdgeInsets.symmetric(horizontal: 8), child: CircularProgressIndicator(value: null))
                : const SizedBox()));
  }
}
