import 'dart:typed_data';

import 'package:flutter_blue_plus/flutter_blue_plus.dart';

class BtCommand {
  final Guid service;
  final Guid characteristic;
  final Uint8List opcode;
  final Uint8List? parameters;

  Uint8List getPayload() {
    BytesBuilder builder = BytesBuilder();
    builder.add(opcode);
    if (parameters != null) {
      builder.add(parameters!);
    }
    return builder.takeBytes();
  }

  BtCommand(this.service, this.characteristic, this.opcode, {this.parameters});
}
