import 'package:flutter/material.dart';

class UnitQuantityCard extends StatelessWidget {
  final num value;
  final String unit;
  final int decimalPlaces;

  const UnitQuantityCard(this.value, this.unit, this.decimalPlaces,
      {super.key});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Card(
        child: Column(
          children: [
            Text(
              value.toStringAsFixed(decimalPlaces),
              style: Theme.of(context).textTheme.displayMedium,
            ),
            Text(
              unit,
              style: Theme.of(context).textTheme.labelMedium,
              textAlign: TextAlign.end,
            ),
          ],
        ),
      ),
    );
  }
}
