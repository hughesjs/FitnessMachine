import 'package:flutter/material.dart';
import 'package:open_eqi_sports/common/dependency_injection/dependency_injection.dart';
import 'package:open_eqi_sports/common/layouts/main_layout.dart';

void main() {
  final DependencyInjection container = DependencyInjection.bootstrap();
  final MyApp app = container.get<MyApp>();
  runApp(app);
}

class MyApp extends StatelessWidget {
  final MainLayout mainLayout;
  const MyApp(this.mainLayout, {super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'OpenEqiSports',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
      ),
      darkTheme: ThemeData.dark(), // <---- This needs some version of the fromSeed()
      themeMode: ThemeMode.system,
      home: mainLayout,
    );
  }
}
