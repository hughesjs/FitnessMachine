import 'package:get_it/get_it.dart';
import 'package:fitness_machine/modules/hardware/bt/constants/known_commands.dart';
import 'package:fitness_machine/modules/hardware/services/fitness_machine.dart';
import 'package:fitness_machine/modules/hardware/services/fitness_machine_provider.dart';

class FitnessMachineCommandDispatcher {
  final Stream<FitnessMachine?> currentMachineStream;

  FitnessMachine? _currentMachine;

  FitnessMachineCommandDispatcher() : currentMachineStream = GetIt.I<FitnessMachineProvider>().currentMachineStream {
    currentMachineStream.listen((currentMachine) {
      _currentMachine = currentMachine;
      takeControl();
    });
  }

  // Not sure about this... It'll do for now
  Future<void> takeControl() async {
    _currentMachine?.fitnessMachineControl.write(KnownCommands.requestControl().getPayload());
  }

  Future<void> start() async {
    _currentMachine?.fitnessMachineControl.write(KnownCommands.start().getPayload());
  }

  Future<void> stop() async {
    _currentMachine?.fitnessMachineControl.write(KnownCommands.stop().getPayload());
  }

  Future<void> pause() async {
    _currentMachine?.fitnessMachineControl.write(KnownCommands.pause().getPayload());
  }

  Future<void> resume() async {
    _currentMachine?.fitnessMachineControl.write(KnownCommands.resume().getPayload());
  }

  Future<void> setSpeed(double speed) async {
    _currentMachine?.fitnessMachineControl.write(KnownCommands.setSpeed(speed).getPayload());
  }
}
