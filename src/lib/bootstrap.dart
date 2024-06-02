import 'package:fitness_machine/workout_management/repositories/completed_workouts_repository.dart';
import 'package:fitness_machine/workout_management/services/completed_workouts_provider.dart';
import 'package:fitness_machine/workout_management/services/workout_state_manager.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:logger/logger.dart';
import 'package:fitness_machine/hardware/services/fitness_machine_command_dispatcher.dart';
import 'package:fitness_machine/hardware/services/fitness_machine_provider.dart';
import 'package:fitness_machine/hardware/services/fitness_machine_query_dispatcher.dart';
import 'package:fitness_machine/hardware/widgets/pages/device_selection_screen.dart';
import 'package:fitness_machine/layouts/main_layout.dart';
import 'package:fitness_machine/layouts/page_definition.dart';
import 'package:fitness_machine/layouts/page_definition_provider.dart';
import 'package:fitness_machine/main.dart';
import 'package:fitness_machine/treadmill_control/widgets/pages/control_page.dart';
import 'package:fitness_machine/workout_management/widgets/pages/workout_history_page.dart';

class Bootstrap {
  static MyApp bootstrap() {
    _setupLogging();
    _registerPages();
    _registerLayouts();
    _registerHardware();
    _registerWorkoutManagement();
    _registerApp();

    return GetIt.I<MyApp>();
  }

  static void _setupLogging() {
    GetIt.I.registerSingleton(Logger());
  }

  static void _registerLayouts() {
    GetIt.I.registerLazySingleton(() => MainLayout(GetIt.I<PageDefinitionProvider>()));
  }

  static void _registerPages() {
    GetIt.I.registerSingleton<ControlPage>(const ControlPage());
    GetIt.I.registerSingleton<WorkoutHistoryPage>(const WorkoutHistoryPage());

    GetIt.I.registerLazySingleton(() => PageDefinitionProvider({
          PageDefinition(GetIt.I<ControlPage>(), "Control", const Icon(Icons.bluetooth), const Icon(Icons.bluetooth_outlined)),
          PageDefinition(GetIt.I<WorkoutHistoryPage>(), "Workout History", const Icon(Icons.history), const Icon(Icons.history_outlined))
        }));
  }

  static void _registerApp() {
    GetIt.I.registerLazySingleton<MyApp>(() {
      return MyApp(GetIt.I<MainLayout>());
    });
  }

  static void _registerHardware() {
    // Use SafeDevice if we need to inject fakes for simulator
    WidgetsFlutterBinding.ensureInitialized();

    GetIt.I.registerSingleton<FitnessMachineProvider>(FitnessMachineProvider());
    GetIt.I.registerSingleton<FitnessMachineCommandDispatcher>((FitnessMachineCommandDispatcher()));
    GetIt.I.registerSingleton<FitnessMachineQueryDispatcher>((FitnessMachineQueryDispatcher()));
    GetIt.I.registerSingleton<DeviceSelectionScreen>(const DeviceSelectionScreen());
  }
  
  static void _registerWorkoutManagement() {
    GetIt.I.registerSingleton<WorkoutStateManager>(WorkoutStateManager());
    GetIt.I.registerSingleton<CompletedWorkoutsRepository>(CompletedWorkoutsRepository());
    GetIt.I.registerSingleton<CompletedWorkoutsProvider>(CompletedWorkoutsProvider());
    
  }
}
