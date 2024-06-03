

import 'package:fitness_machine/workout_management/widgets/controls/workout_history_list.dart';
import 'package:flutter/material.dart';

class WorkoutHistoryPage extends StatelessWidget {
  const WorkoutHistoryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(child: 
    WorkoutHistoryList());
  }
}
