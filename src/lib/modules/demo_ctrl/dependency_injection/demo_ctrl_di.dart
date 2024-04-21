import 'package:get_it/get_it.dart';
import 'package:fitness_machine/modules/demo_ctrl/widgets/pages/control_page.dart';

extension DependencyInjectionExtensions on GetIt {
  Future<GetIt> addDemoControl() async {
    registerSingleton<ControlPage>(ControlPage());
    return this;
  }
}
