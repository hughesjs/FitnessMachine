import 'package:flutter/material.dart';
import 'package:open_eqi_sports/common/layouts/main_layout.dart';
import 'package:open_eqi_sports/common/layouts/page_definition.dart';
import 'package:open_eqi_sports/common/layouts/page_definition_provider.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/control_page.dart';
import 'package:open_eqi_sports/modules/overview/overview_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Do this with DI or reflection later
    const Set<PageDefinition> pages = {
      PageDefinition(OverviewPage(), "Overview", Icon(Icons.home), Icon(Icons.home_outlined)),
      PageDefinition(ControlPage(), "Control", Icon(Icons.bluetooth), Icon(Icons.bluetooth_outlined))
    };

    const PageDefinitionProvider pageProvider = PageDefinitionProvider(pages);

    return MaterialApp(
      title: 'OpenEqiSports',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
      ),
      darkTheme: ThemeData.dark(), // <---- This needs some version of the fromSeed()
      themeMode: ThemeMode.system,
      home: const MainLayout(pageProvider),
    );
  }
}
