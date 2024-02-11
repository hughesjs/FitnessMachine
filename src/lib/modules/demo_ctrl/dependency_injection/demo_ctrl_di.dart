import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/control_page.dart';

extension DependencyInjectionExtensions on GetIt {
  GetIt addDemoControl() {
    registerSingleton<ControlPage>(const ControlPage());
    return this;
  }
}
