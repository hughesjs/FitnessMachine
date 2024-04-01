import 'package:flutter/material.dart';

class UnitQuantityCard extends StatelessWidget {
  final int value;
  final String unit;

  const UnitQuantityCard(int this.value, String this.unit, {super.key});

  @override
  Widget build(BuildContext context) {
    final valString = value.toStringAsFixed(2);
    return Expanded(
      child: Card(
        child: Row(
          children: [
            Text(
              valString,
              style: Theme.of(context).textTheme.displayLarge,
            ),
            Expanded(
              child: Text(
                unit,
                style: Theme.of(context).textTheme.labelLarge,
                textAlign: TextAlign.end,
              ),
            )
          ],
        ),
      ),
    );
  }
}
