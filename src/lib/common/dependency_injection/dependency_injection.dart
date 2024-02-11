import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/main.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/dependency_injection/demo_ctrl_di.dart';
import 'package:open_eqi_sports/modules/overview/dependency_injection/overview_di.dart';

class DependencyInjection {
  late GetIt _services;

  DependencyInjection() {
    _services = GetIt.I;
  }

  factory DependencyInjection.bootstrap() {
    DependencyInjection di = DependencyInjection();

    di._services.registerSingleton<MyApp>(const MyApp());
    di._services.addDemoControl();
    di._services.addOverview();

    return di;
  }

  T get<T extends Object>() {
    return _services.get<T>();
  }
}
