import 'package:fitness_machine/common/widgets/controls/text_with_icon.dart';
import 'package:fitness_machine/workout_management/models/completed_workout.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class WorkoutHistoryListItem extends StatelessWidget {

  final CompletedWorkout workout;

  const WorkoutHistoryListItem(this.workout, {super.key});

  @override
  Widget build(BuildContext context) {
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
                            TextWithIcon(DateFormat("dd-MM-yyyy  HH:mm").format(workout.startedAt), const Icon(Icons.calendar_month)),
                            TextWithIcon("${(workout.workoutTimeInSeconds / 60).toStringAsFixed(1)} mins", const Icon(Icons.timer)),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            TextWithIcon("${workout.distanceInKm.toStringAsFixed(2)} km", const Icon(Icons.place)),
                            TextWithIcon("${workout.totalSteps} steps", const Icon(Icons.directions_walk)),
                            TextWithIcon("${workout.machineIndicatedCalories} kcal", const Icon(Icons.local_fire_department)),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              );
  }
}