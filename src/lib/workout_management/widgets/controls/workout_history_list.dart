import 'package:fitness_machine/workout_management/models/completed_workout.dart';
import 'package:fitness_machine/workout_management/widgets/cubits/workout_history_cubit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:logger/logger.dart';

class WorkoutHistoryList extends StatelessWidget {
  final Logger _logger;

  WorkoutHistoryList({super.key}): _logger = GetIt.I<Logger>();

  @override
  Widget build(BuildContext context) {
    return BlocProvider<WorkoutHistoryCubit>(
          create: (context) => WorkoutHistoryCubit(),
          child: BlocBuilder<WorkoutHistoryCubit, List<CompletedWorkout>>(builder: (context, state) {
            return ListView.builder(
                itemCount: state.length,
                itemBuilder: (context, index) {
                  final workout = state[index];
                  return ListTile(
                      title: Text(workout.startedAt.toString()),
                      subtitle: Text("${workout.distanceInKm}km in ${workout.workoutTimeInSeconds}s"),
                      onTap: () {
                        _logger.i("Tapped workout ${workout.workoutId}... It wasn't very effective");
                      });
                });
          }));
  }
}
