import 'package:flutter/material.dart';

class UnitQuantityCard extends StatelessWidget {
  final num value;
  final String unit;
  final int decimalPlaces;

  const UnitQuantityCard(this.value, this.unit, this.decimalPlaces,
      {super.key});

  @override
  Widget build(BuildContext context) {
    final valString = value.toStringAsFixed(decimalPlaces);
    return Expanded(
      child: Card(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Text(
              valString,
              style: Theme.of(context).textTheme.displayLarge,
            ),
            Text(
              unit,
              style: Theme.of(context).textTheme.labelLarge,
              textAlign: TextAlign.end,
            ),
          ],
        ),
      ),
    );
  }
}
