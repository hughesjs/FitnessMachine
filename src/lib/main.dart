import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:wakelock_plus/wakelock_plus.dart';
import 'package:open_eqi_sports/common/dependency_injection/dependency_injection.dart';
import 'package:open_eqi_sports/common/layouts/main_layout.dart';

Future<void> main() async {
  final DependencyInjection container = await DependencyInjection.bootstrap();
  final MyApp app = container.get<MyApp>();
  if (kDebugMode) {
    print("Enabling wakelock in debug mode");
    WakelockPlus.enable();
  }
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
