import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import {CompletedWorkout} from '../../models';
import {WorkoutRepository} from './WorkoutRepository';
import {
  DatabaseResult,
  dbSuccess,
  dbError,
  workoutToRow,
  rowToWorkout,
  WorkoutRow,
} from './DatabaseTypes';

// Enable debugging in development
SQLite.DEBUG(false);
SQLite.enablePromise(true);

const DATABASE_NAME = 'fitness_machine.db';
const DATABASE_VERSION = 1;
const TABLE_NAME = 'completed_workouts';

/**
 * SQLite implementation of WorkoutRepository.
 */
export class SQLiteWorkoutRepository implements WorkoutRepository {
  private db: SQLiteDatabase | null = null;

  async initialize(): Promise<void> {
    this.db = await SQLite.openDatabase({
      name: DATABASE_NAME,
      location: 'default',
    });

    await this.createTablesIfNeeded();
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }

  /**
   * Executes a function within a database transaction.
   * If the function throws an error, the transaction is rolled back.
   */
  private async executeInTransaction<T>(
    operation: (db: SQLiteDatabase) => Promise<T>,
  ): Promise<DatabaseResult<T>> {
    if (!this.db) {
      return dbError('Database not initialized');
    }

    try {
      await this.db.executeSql('BEGIN TRANSACTION');

      try {
        const result = await operation(this.db);
        await this.db.executeSql('COMMIT');
        return dbSuccess(result);
      } catch (error) {
        await this.db.executeSql('ROLLBACK');
        throw error;
      }
    } catch (error) {
      return dbError(
        error instanceof Error ? error.message : 'Transaction failed',
      );
    }
  }

  async saveWorkout(workout: CompletedWorkout): Promise<DatabaseResult<void>> {
    return this.executeInTransaction(async db => {
      const row = workoutToRow(workout);

      await db.executeSql(
        `INSERT OR REPLACE INTO ${TABLE_NAME}
         (workout_id, distance_in_km, total_steps, workout_time_in_seconds,
          machine_indicated_calories, calculated_calories, started_at, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          row.workout_id,
          row.distance_in_km,
          row.total_steps,
          row.workout_time_in_seconds,
          row.machine_indicated_calories,
          row.calculated_calories,
          row.started_at,
          row.completed_at,
        ],
      );
    });
  }

  async getAllWorkouts(): Promise<DatabaseResult<CompletedWorkout[]>> {
    if (!this.db) {
      return dbError('Database not initialized');
    }

    try {
      const [results] = await this.db.executeSql(
        `SELECT * FROM ${TABLE_NAME} ORDER BY completed_at DESC`,
      );

      const workouts: CompletedWorkout[] = [];
      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i) as WorkoutRow;
        workouts.push(rowToWorkout(row));
      }

      return dbSuccess(workouts);
    } catch (error) {
      return dbError(
        error instanceof Error ? error.message : 'Failed to get workouts',
      );
    }
  }

  async getWorkoutById(
    workoutId: string,
  ): Promise<DatabaseResult<CompletedWorkout | null>> {
    if (!this.db) {
      return dbError('Database not initialized');
    }

    try {
      const [results] = await this.db.executeSql(
        `SELECT * FROM ${TABLE_NAME} WHERE workout_id = ?`,
        [workoutId],
      );

      if (results.rows.length === 0) {
        return dbSuccess(null);
      }

      const row = results.rows.item(0) as WorkoutRow;
      return dbSuccess(rowToWorkout(row));
    } catch (error) {
      return dbError(
        error instanceof Error ? error.message : 'Failed to get workout',
      );
    }
  }

  async deleteWorkout(workoutId: string): Promise<DatabaseResult<void>> {
    if (!this.db) {
      return dbError('Database not initialized');
    }

    try {
      await this.db.executeSql(
        `DELETE FROM ${TABLE_NAME} WHERE workout_id = ?`,
        [workoutId],
      );
      return dbSuccess(undefined);
    } catch (error) {
      return dbError(
        error instanceof Error ? error.message : 'Failed to delete workout',
      );
    }
  }

  async deleteAllWorkouts(): Promise<DatabaseResult<void>> {
    if (!this.db) {
      return dbError('Database not initialized');
    }

    try {
      await this.db.executeSql(`DELETE FROM ${TABLE_NAME}`);
      return dbSuccess(undefined);
    } catch (error) {
      return dbError(
        error instanceof Error ? error.message : 'Failed to delete workouts',
      );
    }
  }

  async getWorkoutCount(): Promise<DatabaseResult<number>> {
    if (!this.db) {
      return dbError('Database not initialized');
    }

    try {
      const [results] = await this.db.executeSql(
        `SELECT COUNT(*) as count FROM ${TABLE_NAME}`,
      );

      const count = (results.rows.item(0) as {count: number}).count;
      return dbSuccess(count);
    } catch (error) {
      return dbError(
        error instanceof Error ? error.message : 'Failed to count workouts',
      );
    }
  }

  private async createTablesIfNeeded(): Promise<void> {
    if (!this.db) {
      return;
    }

    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        workout_id TEXT PRIMARY KEY NOT NULL,
        distance_in_km REAL NOT NULL,
        total_steps INTEGER NOT NULL,
        workout_time_in_seconds INTEGER NOT NULL,
        machine_indicated_calories REAL NOT NULL,
        calculated_calories REAL NOT NULL,
        started_at TEXT NOT NULL,
        completed_at TEXT NOT NULL
      )
    `);

    // Create index for faster sorting
    await this.db.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_completed_at
      ON ${TABLE_NAME} (completed_at DESC)
    `);
  }
}
