import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/services/fake_treadmilll_control_service.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/services/treadmill_workout_union.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/widgets/pages/control_page.dart';
import 'package:open_eqi_sports/modules/demo_ctrl/services/treadmill_control_service.dart';
import 'package:safe_device/safe_device.dart';

extension DependencyInjectionExtensions on GetIt {
  Future<GetIt> addDemoControl() async {
    await _addTreadmillControlService(this);
    registerSingleton<ControlPage>(ControlPage(get<TreadmillControlService>()));
    return this;
  }

  // This will inject a fake if we're in the sim
  Future<void> _addTreadmillControlService(GetIt getIt) async {
    WidgetsFlutterBinding.ensureInitialized();
    if (await SafeDevice.isRealDevice) {
      registerSingleton<TreadmillControlService>(TreadmillControlService(TreadmillWorkoutUnion.initial()));
    } else {
      registerSingleton<TreadmillControlService>(FakeTreadmillControlService(TreadmillWorkoutUnion.initial()));
      print("Injecting fake treadmill service");
    }
  }
}
