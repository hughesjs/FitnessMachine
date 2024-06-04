import 'package:fitness_machine/workout_management/models/completed_workout.dart';
import 'package:fitness_machine/workout_management/widgets/controls/workout_history_list_item.dart';
import 'package:fitness_machine/workout_management/widgets/cubits/workout_history_cubit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class WorkoutHistoryList extends StatelessWidget {
  const WorkoutHistoryList({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider<WorkoutHistoryCubit>(
      create: (context) => WorkoutHistoryCubit(),
      child: BlocBuilder<WorkoutHistoryCubit, List<CompletedWorkout>>(
        builder: (context, state) {
          return ListView.builder(
            itemCount: state.length,
            itemBuilder: (context, index) {
              final workout = state[index];
              return WorkoutHistoryListItem(workout);
            },
          );
        },
      ),
    );
  }


}
