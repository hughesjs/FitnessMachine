import 'package:flutter/material.dart';

// TODO - Try and get from Health and launch a toast if successful

class HeightAndWeightPage extends StatelessWidget {
  const HeightAndWeightPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(fit: StackFit.expand, 
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

                const HeightWeightWidget(),
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
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Expanded(
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              onTapOutside: (e) => FocusScope.of(context).unfocus(),
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                label: Text("Height"),
                border: OutlineInputBorder(),
                suffixText: "cm"
              ),
            ),
          ),
        ),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              onTapOutside: (_) => FocusScope.of(context).unfocus(),
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                label: Text("Weight"),
                border: OutlineInputBorder(),
                suffixText: "kg"
              ),
            ),
          ),
        ),
      ],
    );}}