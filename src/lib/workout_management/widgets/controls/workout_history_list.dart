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
                          Expanded(child: _textWithIcon(DateFormat("dd-MM-yyyy  HH:mm").format(workout.startedAt), const Icon(Icons.calendar_month))),
                          _textWithIcon("${workout.workoutTimeInSeconds / 60} mins", const Icon(Icons.timer)),
                        ],
                      ),
                      Row(
                        children: [
                          Align(alignment: Alignment.centerLeft, child: _textWithIcon("${workout.distanceInKm} km", const Icon(Icons.place))),
                          Expanded(child: Align(alignment: Alignment.center, child: _textWithIcon("${workout.totalSteps} steps", const Icon(Icons.directions_walk)))),
                          Align(alignment: Alignment.centerRight, child: _textWithIcon("${workout.machineIndicatedCalories} kcal", const Icon(Icons.local_fire_department))),
                        ],
                      ),
                    ]))));
              });
        }));
  }

  Widget _textWithIcon(String text, Icon icon) {
    return Wrap(children: [icon, Text(text)]);
  }
}
