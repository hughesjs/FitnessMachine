import 'dart:typed_data';
import 'package:open_eqi_sports/common/utility/number_extensions.dart';
import 'package:open_eqi_sports/modules/hardware/bt/bt_command.dart';
import 'package:open_eqi_sports/modules/hardware/bt/known_characteristics.dart';
import 'package:open_eqi_sports/modules/hardware/bt/known_opcodes.dart';

// See FTMS 4.16
class KnownCommands {
  static BtCommand requestControl() => BtCommand(KnownCharacteristics.fitnessMachineControl, KnownOpcodes.requestControl);

  static BtCommand reset() => BtCommand(KnownCharacteristics.fitnessMachineControl, KnownOpcodes.reset);

  static BtCommand setSpeed(double speedInKmh) {
    int speedIncrementsToRequest = (speedInKmh * 100).toInt();
    return BtCommand(KnownCharacteristics.fitnessMachineControl, KnownOpcodes.setTargetSpeed,
        payload: speedIncrementsToRequest.toByteBufferLittleEndian(2).buffer.asUint8List());
  }

  static BtCommand start() =>
      BtCommand(KnownCharacteristics.fitnessMachineControl, KnownOpcodes.startOrResume, payload: Uint8List.fromList([0x01]));

  static BtCommand resume() =>
      BtCommand(KnownCharacteristics.fitnessMachineControl, KnownOpcodes.startOrResume, payload: Uint8List.fromList([0x02]));

  static BtCommand stop() =>
      BtCommand(KnownCharacteristics.fitnessMachineControl, KnownOpcodes.stopOrPause, payload: Uint8List.fromList([0x01]));

  static BtCommand pause() =>
      BtCommand(KnownCharacteristics.fitnessMachineControl, KnownOpcodes.stopOrPause, payload: Uint8List.fromList([0x02]));

  static BtCommand setTargetSteps(int targetSteps) => BtCommand(KnownCharacteristics.fitnessMachineControl, KnownOpcodes.setTargetSteps,
      payload: targetSteps.toByteBufferLittleEndian(2).buffer.asUint8List());

  static BtCommand setTargetDistance(int targetDistance) =>
      BtCommand(KnownCharacteristics.fitnessMachineControl, KnownOpcodes.setTargetDistance,
          payload: targetDistance.toByteBufferLittleEndian(3).buffer.asUint8List());

  static BtCommand setTargetTime(int targetTime) => BtCommand(KnownCharacteristics.fitnessMachineControl, KnownOpcodes.setTargetTime,
      payload: targetTime.toByteBufferLittleEndian(2).buffer.asUint8List());
}
