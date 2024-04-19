import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:open_eqi_sports/modules/hardware/widgets/models/device_descriptor.dart';

class FitnessMachineCubit extends Cubit<List<DeviceDescriptor>> {
  Timer? _timer;

  FitnessMachineCubit() : super([]) {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) => fetchData());
  }

  // Example function to fetch data
  void fetchData() {
    List<DeviceDescriptor> newData = [
      DeviceDescriptor("Treadmill", "CITYSPORTS-Linker"),
      DeviceDescriptor("Bike", "CITYSPORTS-Linker"),
      DeviceDescriptor("Bike", "CITYSPORTS-Linker"),
    ];
    emit(newData);
  }

  @override
  Future<void> close() {
    _timer?.cancel();
    return super.close();
  }
}
