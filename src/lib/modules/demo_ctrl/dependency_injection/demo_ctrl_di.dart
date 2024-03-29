import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/pages/control_page.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/treadmill_ctrl/treadmill_control_service.dart';

extension DependencyInjectionExtensions on GetIt {
  GetIt addDemoControl() {
    registerSingleton<TreadmillControlService>(TreadmillControlService());
    registerSingleton<ControlPage>(ControlPage(get<TreadmillControlService>()));
    return this;
  }
}
