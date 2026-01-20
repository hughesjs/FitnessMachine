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
            _DurationTimeComponent(time: hours),
            const _DurationSeparator(),
            _DurationTimeComponent(time: minutes),
            const _DurationSeparator(),
            _DurationTimeComponent(time: seconds),
          ],
        ),
      ),
    );
  }
}

class _DurationTimeComponent extends StatelessWidget {
  const _DurationTimeComponent({
    required this.time,
  });

  final String time;

  @override
  Widget build(BuildContext context) {
    return Text(
      time,
      style: Theme.of(context).textTheme.displayLarge,
    );
  }
}

class _DurationSeparator extends StatelessWidget {
  const _DurationSeparator();

  @override
  Widget build(BuildContext context) {
    return Text(
      ' : ',
      style: Theme.of(context).textTheme.labelLarge,
    );
  }
}
