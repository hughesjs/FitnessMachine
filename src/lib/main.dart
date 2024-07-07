import 'package:fitness_machine/onboarding/layouts/onboarding_layout.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:logger/logger.dart';
import 'package:fitness_machine/bootstrap.dart';
import 'package:wakelock_plus/wakelock_plus.dart';
import 'package:fitness_machine/layouts/main_layout.dart';

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
      darkTheme: ThemeData.dark(), // <---- This needs some version of the fromSeed()
      themeMode: ThemeMode.system,
      home: const OnboardingLayout(), // TODO: Add a shim between the main layout and the onboarding layout
    );
  }
}
