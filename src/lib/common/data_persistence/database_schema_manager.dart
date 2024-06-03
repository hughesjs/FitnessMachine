import 'package:fitness_machine/common/data_persistence/database_provider.dart';
import 'package:get_it/get_it.dart';
import 'package:logger/logger.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseSchemaManager {

  final  Logger _logger;

  DatabaseSchemaManager(): _logger = GetIt.I<Logger>();

  Future<void> setupSchema() async {
    final db = await GetIt.I<DatabaseProvider>().database;
    await _createCompletedWorkoutSchema(db);    
  }


    // TODO: move this somewhere else that can handle migrations
  Future<void> _createCompletedWorkoutSchema(Database db) async {
    _logger.i("Creating schema completed workouts");
    const String completedWorkoutTableSql = """
                                            CREATE TABLE IF NOT EXISTS completed_workouts (
                                              workoutId STRING PRIMARY KEY,
                                              distanceInKm REAL NOT NULL,
                                              totalSteps INTEGER NOT NULL,
                                              workoutTimeInSeconds INTEGER NOT NULL,
                                              machineIndicatedCalories REAL NOT NULL,
                                              calculatedCalories REAL NOT NULL,
                                              startedAt TEXT NOT NULL,
                                              completedAt TEXT NOT NULL
                                            );
                                            """;        
  
    await db.execute(completedWorkoutTableSql);
    _logger.i("Completed workout schema created");
  }
}