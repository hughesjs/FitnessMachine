import 'dart:typed_data';
import 'package:open_eqi_sports/common/utility/number_extensions.dart';
import 'package:open_eqi_sports/modules/hardware/bt/constants/known_services.dart';
import 'package:open_eqi_sports/modules/hardware/bt/models/bt_command.dart';
import 'package:open_eqi_sports/modules/hardware/bt/constants/known_characteristics.dart';
import 'package:open_eqi_sports/modules/hardware/bt/constants/known_opcodes.dart';

// See FTMS 4.16
class KnownCommands {
  static BtCommand requestControl() =>
      BtCommand(KnownServices.fitnessMachine, KnownCharacteristics.fitnessMachineControl, KnownOpcodes.requestControl);

  static BtCommand reset() => BtCommand(KnownServices.fitnessMachine, KnownCharacteristics.fitnessMachineControl, KnownOpcodes.reset);

  static BtCommand setSpeed(double speedInKmh) {
    int speedIncrementsToRequest = (speedInKmh * 100).toInt();
    return BtCommand(KnownServices.fitnessMachine, KnownCharacteristics.fitnessMachineControl, KnownOpcodes.setTargetSpeed,
        parameters: speedIncrementsToRequest.toByteBufferLittleEndian(2).buffer.asUint8List());
  }

  static BtCommand start() =>
      BtCommand(KnownServices.fitnessMachine, KnownCharacteristics.fitnessMachineControl, KnownOpcodes.startOrResume,
          parameters: Uint8List.fromList([0x01]));

  static BtCommand resume() =>
      BtCommand(KnownServices.fitnessMachine, KnownCharacteristics.fitnessMachineControl, KnownOpcodes.startOrResume,
          parameters: Uint8List.fromList([0x02]));

  static BtCommand stop() => BtCommand(KnownServices.fitnessMachine, KnownCharacteristics.fitnessMachineControl, KnownOpcodes.stopOrPause,
      parameters: Uint8List.fromList([0x01]));

  static BtCommand pause() => BtCommand(KnownServices.fitnessMachine, KnownCharacteristics.fitnessMachineControl, KnownOpcodes.stopOrPause,
      parameters: Uint8List.fromList([0x02]));

  static BtCommand setTargetSteps(int targetSteps) =>
      BtCommand(KnownServices.fitnessMachine, KnownCharacteristics.fitnessMachineControl, KnownOpcodes.setTargetSteps,
          parameters: targetSteps.toByteBufferLittleEndian(2).buffer.asUint8List());

  static BtCommand setTargetDistance(int targetDistance) =>
      BtCommand(KnownServices.fitnessMachine, KnownCharacteristics.fitnessMachineControl, KnownOpcodes.setTargetDistance,
          parameters: targetDistance.toByteBufferLittleEndian(3).buffer.asUint8List());

  static BtCommand setTargetTime(int targetTime) =>
      BtCommand(KnownServices.fitnessMachine, KnownCharacteristics.fitnessMachineControl, KnownOpcodes.setTargetTime,
          parameters: targetTime.toByteBufferLittleEndian(2).buffer.asUint8List());
}
