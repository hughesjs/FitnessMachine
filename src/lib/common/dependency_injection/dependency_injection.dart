import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/common/layouts/main_layout.dart';
import 'package:open_eqi_sports/common/layouts/page_definition.dart';
import 'package:open_eqi_sports/common/layouts/page_definition_provider.dart';
import 'package:open_eqi_sports/main.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/pages/control_page.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/dependency_injection/demo_ctrl_di.dart';
import 'package:open_eqi_sports/modules/overview/dependency_injection/overview_di.dart';
import 'package:open_eqi_sports/modules/overview/overview_page.dart';

class DependencyInjection {
  late GetIt _services;

  DependencyInjection() {
    _services = GetIt.instance;
  }

  factory DependencyInjection.bootstrap() {
    DependencyInjection di = DependencyInjection();

    // This is crap, and breaks the module decoupling, but as far as I can tell there's no way to register these all
    // Individually in the modules and then resolve them: https://github.com/fluttercommunity/get_it/issues/75
    // So this will do for now
    di._services.registerLazySingleton(() => PageDefinitionProvider({
          PageDefinition(di._services<OverviewPage>(), "Overview",
              const Icon(Icons.home), const Icon(Icons.home_outlined)),
          PageDefinition(di._services<ControlPage>(), "Control",
              const Icon(Icons.bluetooth), const Icon(Icons.bluetooth_outlined))
        }));

    di._services.registerLazySingleton<MainLayout>(
        () => MainLayout(di._services<PageDefinitionProvider>()));

    di._services.registerLazySingleton<MyApp>(() {
      return MyApp(di._services<MainLayout>());
    });

    di._services.addDemoControl();
    di._services.addOverview();

    return di;
  }

  T get<T extends Object>() {
    return _services.get<T>();
  }
}
