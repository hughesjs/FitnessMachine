import 'package:fitness_machine/workout_management/models/completed_workout.dart';
import 'package:fitness_machine/workout_management/widgets/cubits/workout_history_cubit.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';

class WorkoutHistoryList extends StatelessWidget {
  const WorkoutHistoryList({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider<WorkoutHistoryCubit>(
        create: (context) => WorkoutHistoryCubit(),
        child: BlocBuilder<WorkoutHistoryCubit, List<CompletedWorkout>>(builder: (context, state) {
          return ListView.builder(
              itemCount: state.length,
              itemBuilder: (context, index) {
                final workout = state[index];
                return Container(
                    padding: const EdgeInsets.all(5),
                    child: Card( 
                        child: Padding(
                          padding: const EdgeInsets.all(15),
                          child: Column(children: [
                      Row(
                        children: [
                          Expanded(child: Text(DateFormat("dd-MM-yyyy  HH:mm").format(workout.startedAt))),
                          Text("${workout.workoutTimeInSeconds / 60} mins")
                        ],
                      ),
                      Row(
                        children: [
                          Align(alignment: Alignment.centerLeft, child: Text("${workout.distanceInKm} km")),
                          Expanded(child: Text("${workout.totalSteps} steps")),
                          Align(alignment: Alignment.centerRight, child: Text("${workout.machineIndicatedCalories} kcal"))
                        ],
                      ),
                    ]))));
              });
        }));
  }
}
