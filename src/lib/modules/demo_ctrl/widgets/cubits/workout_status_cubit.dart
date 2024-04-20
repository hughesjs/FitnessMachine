import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/hardware/services/fitness_machine_query_dispatcher.dart';
import 'package:open_eqi_sports/modules/hardware/bt/models/treadmill_data.dart';

class TrainingStatusCubit extends Cubit<TreadmillData> {
  final FitnessMachineQueryDispatcher _fitnessMachineQueryDispatcher;

  late StreamSubscription _sub;

  TrainingStatusCubit()
      : _fitnessMachineQueryDispatcher = GetIt.I<FitnessMachineQueryDispatcher>(),
        super(TreadmillData.zero()) {
    _sub = _fitnessMachineQueryDispatcher.treadmillDataStream.listen((state) {
      emit(state);
    });
  }

  @override
  Future<void> close() async {
    _sub.cancel();
    super.close();
  }
}
