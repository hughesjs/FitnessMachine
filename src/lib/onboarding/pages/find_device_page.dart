import 'package:fitness_machine/hardware/widgets/pages/device_selection_screen.dart';
import 'package:flutter/material.dart';

class FindDevicePage extends StatelessWidget {
  const FindDevicePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
        fit: StackFit.expand,
        children: <Widget>[
          Center(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Icon(Icons.bluetooth_outlined, size: 200, color: Theme.of(context).colorScheme.primary),
                  const SizedBox(height: 50),
                  const Text(
                    'Connect Your Device',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const Text("What are we controlling?"),
                  const SizedBox(height: 20),
                  ElevatedButton(onPressed: () => openBluetoothPage(context) /*TODO - Request Health*/, child: const Text("Find Bluetooth Device")),
                  const SizedBox(height: 20)
                ],
              ),
            ),
          ),
        ],
      );
  }

  Future<void> openBluetoothPage(BuildContext context) async {
    await Navigator.push(context, MaterialPageRoute(builder: (_) => const DeviceSelectionScreen()));
  }
}