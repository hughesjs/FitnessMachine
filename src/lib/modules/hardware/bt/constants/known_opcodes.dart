import 'dart:typed_data';

class KnownOpcodes {
  static final Uint8List requestControl = Uint8List.fromList([0x00]);
  static final Uint8List reset = Uint8List.fromList([0x01]);
  static final Uint8List setTargetSpeed = Uint8List.fromList([0x02]);
  static final Uint8List startOrResume = Uint8List.fromList([0x07]);
  static final Uint8List stopOrPause = Uint8List.fromList([0x08]);
  static final Uint8List setTargetSteps = Uint8List.fromList([0x0a]);
  static final Uint8List setTargetDistance = Uint8List.fromList([0x0c]);
  static final Uint8List setTargetTime = Uint8List.fromList([0x0d]);
}
