import 'package:flutter/widgets.dart';

class PageDefinition {
  final Type content;
  final String title;
  final Icon selectedIcon;
  final Icon unselectedIcon;

  const PageDefinition(this.content, this.title, this.selectedIcon, this.unselectedIcon);
}
