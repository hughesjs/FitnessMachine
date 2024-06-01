import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:fitness_machine/common/lib_extensions/number_extensions.dart';

void main() {
  group('int -> little endian byte buffer', () {
    test("1 byte", () {
      const int testValue = 43;
      final expected = Uint8List.fromList([0x2b]);
      final res = testValue.toByteBufferLittleEndian(1).buffer.asUint8List();
      expect(res, expected);
    });

    test("2 bytes all used", () {
      const int testValue = 2234;
      final expected = Uint8List.fromList([0xba, 0x08]);
      final res = testValue.toByteBufferLittleEndian(2).buffer.asUint8List();
      expect(res, expected);
    });

    test("2 bytes half used", () {
      const int testValue = 12;
      final expected = Uint8List.fromList([0x0c, 0x00]);
      final res = testValue.toByteBufferLittleEndian(2).buffer.asUint8List();
      expect(res, expected);
    });

    test("3 bytes all used", () {
      const int testValue = 524321;
      final expected = Uint8List.fromList([0x21, 0x00, 0x08]);
      final res = testValue.toByteBufferLittleEndian(3).buffer.asUint8List();
      expect(res, expected);
    });

    test("3 bytes part used", () {
      const int testValue = 12;
      final expected = Uint8List.fromList([0x0c, 0x00, 0x00]);
      final res = testValue.toByteBufferLittleEndian(3).buffer.asUint8List();
      expect(res, expected);
    });

    test("3 bytes zero", () {
      const int testValue = 0;
      final expected = Uint8List.fromList([0x00, 0x00, 0x00]);
      final res = testValue.toByteBufferLittleEndian(3).buffer.asUint8List();
      expect(res, expected);
    });

    test("invalid sized buffer", () {
      const int testValue = 1 << 8;
      expect(() => testValue.toByteBufferLittleEndian(1), throwsException);
    });
  });
}
