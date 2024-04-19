import 'package:flutter/foundation.dart';

class SupportedSpeedRange {
  final double minSpeedInKmh;
  final double maxSpeedInKmh;
  final double minIncrementInKmh;

  SupportedSpeedRange(this.minSpeedInKmh, this.maxSpeedInKmh, this.minIncrementInKmh);

  factory SupportedSpeedRange.fromBytes(List<int> rawData) {
    Uint8List status = Uint8List.fromList(rawData);
    ByteData bytes = status.buffer.asByteData();

    int minSpeed = bytes.getUint16(0, Endian.little);
    int maxSpeed = bytes.getUint16(2, Endian.little);
    int minIncrement = bytes.getUint16(4, Endian.little);

    return SupportedSpeedRange(minSpeed / 100, maxSpeed / 100, minIncrement / 100);
  }
}
