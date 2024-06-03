import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseProvider {
  static const String _databaseName = "fitness_machine.db";
  static String? _dbPath;

  Database? _database;

  DatabaseProvider();
  
  Future<Database> get database async {
    _dbPath ??= join(await getDatabasesPath(), _databaseName);
    _database ??= await openDatabase(_dbPath!);
    return _database!;
  }
}