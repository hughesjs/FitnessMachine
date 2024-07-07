import 'dart:io';

import 'package:flutter/material.dart';

class HealthPage extends StatelessWidget {
  const HealthPage({super.key});

  @override
  Widget build(BuildContext context) {
    return  Stack(
        fit: StackFit.expand,
        children: <Widget>[
          Center(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Icon(Icons.favorite_border, size: 200, color: Theme.of(context).colorScheme.primary),
                  const SizedBox(height: 50),
                  const Text(
                    'Health Integration',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  Platform.isIOS ? const Text("We can sync your workouts to Apple Health")
                  : const Text("We can sync your workouts to Google Fit"), 
                  const SizedBox(height: 20),
                  ElevatedButton(onPressed: (){} /*TODO - Request Health*/, child: const Text("Enable Health Integration")),
                  const SizedBox(height: 20)
                ],
              ),
            ),
          ),
        ],
      );
  }
}