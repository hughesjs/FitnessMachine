import 'package:flutter/material.dart';

class DurationCard extends StatelessWidget {
  final int valueInSeconds;

  const DurationCard(this.valueInSeconds, {super.key});

  @override
  Widget build(BuildContext context) {
    final duration = Duration(seconds: valueInSeconds);
    final hours = duration.inHours.toString().padLeft(2, '0');
    final minutes = duration.inMinutes.remainder(60).toString().padLeft(2, '0');
    final seconds = duration.inSeconds.remainder(60).toString().padLeft(2, '0');
    return Expanded(
      child: Card(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              hours,
              style: Theme.of(context).textTheme.displayLarge,
            ),
            Text(
              ':',
              style: Theme.of(context).textTheme.labelLarge,
            ),
            Text(
              minutes,
              style: Theme.of(context).textTheme.displayLarge,
            ),
            Text(
              ':',
              style: Theme.of(context).textTheme.labelLarge,
            ),
            Text(
              seconds,
              style: Theme.of(context).textTheme.displayLarge,
            ),
          ],
        ),
      ),
    );
  }
}
