import 'package:fitness_machine/common/data_persistence/database_provider.dart';
import 'package:fitness_machine/workout_management/models/completed_workout.dart';
import 'package:fitness_machine/workout_management/services/workout_state_manager.dart';
import 'package:get_it/get_it.dart';
import 'package:logger/logger.dart';
import 'package:sqflite/sqflite.dart';

class CompletedWorkoutsRepository {
  static const String _tableName = "completed_workouts";
  final Logger _logger;
  final WorkoutStateManager _workoutStateManager;
  final DatabaseProvider _databaseProvider;
  
  Database? _db;

  CompletedWorkoutsRepository(): _logger = GetIt.I<Logger>(),
  _workoutStateManager = GetIt.I<WorkoutStateManager>(),
  _databaseProvider = GetIt.I<DatabaseProvider>() {
    _workoutStateManager.workoutCompletedStream.listen((completedWorkout) => addCompletedWorkout(completedWorkout));
  }

  Future<List<CompletedWorkout>> getCompletedWorkouts() async {
    _db ??= await _databaseProvider.database;
    final completedWorkouts = (await _db!.query(_tableName)).map((e) => CompletedWorkout.fromMap(e)).toList();
    return completedWorkouts;
  }

  Future<void> addCompletedWorkout(CompletedWorkout completedWorkout) async {
    _db ??= await _databaseProvider.database;
    await _db!.insert(_tableName, completedWorkout.toMap());

    _logger.i("Added completed workout to repository: ${completedWorkout.workoutId}");
  }
}