import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/widgets/pages/control_page.dart';
import 'package:open_eqi_sports/modules/hardware/services/treadmill_control_service.dart';

extension DependencyInjectionExtensions on GetIt {
  Future<GetIt> addDemoControl() async {
    registerSingleton<ControlPage>(ControlPage(get<TreadmillControlService>()));
    return this;
  }
}
