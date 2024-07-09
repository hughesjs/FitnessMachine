import 'package:flutter/material.dart';
import 'package:logger/logger.dart';

class FinishedSetupPage extends StatelessWidget {

  const FinishedSetupPage({super.key});

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
                  Icon(Icons.done_all_outlined, size: 200, color: Theme.of(context).colorScheme.primary),
                  const SizedBox(height: 50),
                  const Text(
                    "All done!",
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const Text("This can all be changed later in settings"),
                  const SizedBox(height: 20),
                  ElevatedButton(onPressed: () => saveHeightAndWeight(),
                   child: const Text("Save and Launch!")
                   ),
                  const SizedBox(height: 20)
                ],
              ),
            ),
          ),
        ],
      );
  }
  
  Future<void> saveHeightAndWeight() async {
    Logger().w("Not implemented");
  }
}