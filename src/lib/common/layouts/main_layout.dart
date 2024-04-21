import 'package:flutter/material.dart';
import 'package:fitness_machine/common/layouts/page_definition_provider.dart';

class MainLayout extends StatefulWidget {
  final PageDefinitionProvider _pageProvider;

  const MainLayout(this._pageProvider, {super.key});

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int currentPageIndex = 0;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final pages = widget._pageProvider.getPageDefinitions().toList();

    return SafeArea(
      child: Scaffold(
        bottomNavigationBar: NavigationBar(
            onDestinationSelected: (int index) {
              setState(() {
                currentPageIndex = index;
              });
            },
            indicatorColor: theme.colorScheme.primary,
            selectedIndex: currentPageIndex,
            destinations:
                pages.map((e) => NavigationDestination(selectedIcon: e.selectedIcon, icon: e.unselectedIcon, label: e.title)).toList()),
        body: pages[currentPageIndex].content,
      ),
    );
  }
}
