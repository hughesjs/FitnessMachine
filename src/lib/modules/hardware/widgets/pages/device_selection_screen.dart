import 'package:flutter/material.dart';
import 'package:fitness_machine/modules/hardware/widgets/controls/bluetooth_scanning_indicator.dart';
import 'package:fitness_machine/modules/hardware/widgets/controls/fitness_machine_list.dart';

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
                BluetoothScanningIndicator(),
              ],
            ),
            body: const FitnessMachineList()));
  }
}
