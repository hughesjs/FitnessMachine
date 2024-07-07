import 'package:flutter/material.dart';

class HeightAndWeightPage extends StatelessWidget {
  const HeightAndWeightPage({super.key});

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
                Row(children: [
                  Expanded(
                      child: FittedBox(
                    fit: BoxFit.fill,
                    child: Icon(
                      Icons.height_outlined,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  )),
                  Expanded(
                      child: FittedBox(
                    fit: BoxFit.fill,
                    child: Icon(
                      Icons.person_outline,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  )),
                ]),
                const SizedBox(height: 50),
                const Text(
                  'Height and Weight',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                  textAlign: TextAlign.center,
                ),
                const Text("We use this to calculate calories burned"),
                const SizedBox(height: 20),
                TextField(
                  keyboardType: TextInputType.numberWithOptions(decimal: true),
                  decoration: InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'Enter your height',
                    suffixText: "cm"
                  ),

                ),

                HeightWeightWidget(),
                const SizedBox(height: 20)
              ],
            ),
          ),
        ),
      ],
    );
  }
}


class HeightWeightWidget extends StatelessWidget {

  const HeightWeightWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text(
          'Height (cm)',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        TextField(
          keyboardType: TextInputType.number,
          decoration: InputDecoration(
            hintText: 'Enter your height',
            border: OutlineInputBorder(),
          ),
        ),
        SizedBox(height: 20),
        Text(
          'Weight (kg)',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        TextField(
          keyboardType: TextInputType.number,
          decoration: InputDecoration(
            hintText: 'Enter your weight',
            border: OutlineInputBorder(),
          ),
        ),
      ],
    );}}