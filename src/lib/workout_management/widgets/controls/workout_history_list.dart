import 'package:fitness_machine/workout_management/models/completed_workout.dart';
import 'package:fitness_machine/workout_management/widgets/cubits/workout_history_cubit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';

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
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                child: Card(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  elevation: 3,
                  child: Padding(
                    padding: const EdgeInsets.all(15),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _textWithIcon(DateFormat("dd-MM-yyyy  HH:mm").format(workout.startedAt), const Icon(Icons.calendar_month)),
                            _textWithIcon("${(workout.workoutTimeInSeconds / 60).toStringAsFixed(1)} mins", const Icon(Icons.timer)),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _textWithIcon("${workout.distanceInKm.toStringAsFixed(2)} km", const Icon(Icons.place)),
                            _textWithIcon("${workout.totalSteps} steps", const Icon(Icons.directions_walk)),
                            _textWithIcon("${workout.machineIndicatedCalories} kcal", const Icon(Icons.local_fire_department)),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }

  Widget _textWithIcon(String text, Icon icon) {
    return Row(
      children: [
        icon,
        const SizedBox(width: 5),
        Text(text),
      ],
    );
  }
}
