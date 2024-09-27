import 'package:fitness_machine/bootstrap.dart';
import 'package:fitness_machine/layouts/main_layout.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:logger/logger.dart';
import 'package:wakelock_plus/wakelock_plus.dart';

Future<void> main() async {
  final MyApp app = await Bootstrap.bootstrap();
  Logger logger = GetIt.I<Logger>();
  if (kDebugMode) {
    logger.i("Enabling wakelock in debug mode");
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
      title: 'FitnessMachine',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
            seedColor: Colors.blue, brightness: Brightness.dark),
      ),
      themeMode: ThemeMode.system,
      home: mainLayout,
    );
  }
}
