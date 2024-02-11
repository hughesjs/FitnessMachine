import 'package:flutter/material.dart';
import 'package:open_eqi_sports/common/layouts/page_definition.dart';
import 'package:open_eqi_sports/common/layouts/page_definition_provider.dart';

class MainLayout extends StatefulWidget {
  late List<PageDefinition> _pageDefinitions;

  MainLayout(PageDefinitionProvider provider, {super.key}) {
    _pageDefinitions = provider.getPageDefinitions().toList(); // <--- Either make it a list or a set...
  }

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int currentPageIndex = 0;
  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    return Scaffold(
      bottomNavigationBar: NavigationBar(
          onDestinationSelected: (int index) {
            setState(() {
              currentPageIndex = index;
            });
          },
          indicatorColor: theme.colorScheme.primary,
          selectedIndex: currentPageIndex,
          destinations: widget._pageDefinitions
              .map((e) => NavigationDestination(selectedIcon: e.selectedIcon, icon: e.unselectedIcon, label: e.title))
              .toList()),
      body: Card(
        shadowColor: Colors.transparent,
        margin: const EdgeInsets.all(8.0),
        child: SizedBox.expand(
          child: Center(
            child: Text(
              widget._pageDefinitions[currentPageIndex].title,
              style: theme.textTheme.titleLarge,
            ),
          ),
        ),
      ),
    );
  }
}
