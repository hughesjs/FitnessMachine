import 'package:flutter/material.dart';

class TextWithIcon extends StatelessWidget {
  final String text;
  final Icon icon;

  const TextWithIcon(this.text, this.icon, {super.key});

  @override
  Widget build(BuildContext context) {
       return Row(
      children: [
        icon,
        const SizedBox(width: 5),
        Text(text),
      ],
    );
  }
}