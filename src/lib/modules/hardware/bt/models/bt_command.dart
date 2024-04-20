import 'dart:typed_data';

import 'package:flutter_blue_plus/flutter_blue_plus.dart';

class BtCommand {
  final Guid service;
  final Guid characteristic;
  final Uint8List opcode;
  final Uint8List? payload;

  BtCommand(this.service, this.characteristic, this.opcode, {this.payload});
}