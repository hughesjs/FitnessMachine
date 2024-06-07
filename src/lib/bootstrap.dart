import 'package:fitness_machine/common/data_persistence/database_provider.dart';
import 'package:fitness_machine/common/data_persistence/database_schema_manager.dart';
import 'package:fitness_machine/health_integration/health_integration_client.dart';
import 'package:fitness_machine/workout_management/repositories/completed_workouts_repository.dart';
import 'package:fitness_machine/workout_management/services/completed_workouts_provider.dart';
import 'package:fitness_machine/workout_management/services/workout_state_manager.dart';
import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:get_it/get_it.dart';
import 'package:health/health.dart';
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
  static Future<MyApp> bootstrap() async {
    WidgetsFlutterBinding.ensureInitialized();

    _setupLogging();
    Future persistence = _setupPersistence();
    _registerPages();
    _registerLayouts();
    _registerHardware();
    _registerWorkoutManagement();
    Future healthIntegration = _registerHealthIntegration();
    _registerApp();

    Future.wait([persistence, healthIntegration]);

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
    FlutterBluePlus.setLogLevel(LogLevel.error);

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

  static Future<void> _setupPersistence() async {
    GetIt.I.registerSingleton<DatabaseProvider>(DatabaseProvider());
    GetIt.I.registerSingleton<DatabaseSchemaManager>(DatabaseSchemaManager());
    await GetIt.I<DatabaseSchemaManager>().setupSchema();
  }

  static Future<void> _registerHealthIntegration() async {
    Health().configure(useHealthConnectIfAvailable: true);

    var types = [
      HealthDataType.STEPS,
      HealthDataType.DISTANCE_WALKING_RUNNING,
      HealthDataType.TOTAL_CALORIES_BURNED,
      HealthDataType.WORKOUT,
      HealthDataType.WEIGHT,
      HealthDataType.HEIGHT
    ];

    var permissions = [
      HealthDataAccess.WRITE,
      HealthDataAccess.WRITE,
      HealthDataAccess.WRITE,
      HealthDataAccess.WRITE,
      HealthDataAccess.READ,
      HealthDataAccess.READ
    ];

    var permissionsStatus = await Health().requestAuthorization(types, permissions: permissions);

    if (!permissionsStatus) {
      Logger().w("Health permissions denied");
      return;
    }

    GetIt.I.registerSingleton<HealthIntegrationClient>(HealthIntegrationClient());
  }
}
