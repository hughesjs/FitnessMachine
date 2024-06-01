import 'dart:typed_data';

extension NumberExtensions on int {
  ByteData toByteBufferLittleEndian(int byteCount) {
    if (this >= 1 << (8 * byteCount)) {
      throw Exception("Number is too big to fit in $byteCount bytes");
    }
    ByteData buffer = ByteData(byteCount);
    for (int i = 0; i < byteCount; i++) {
      buffer.setUint8(i, (this >> (i * 8)) & 0xff);
    }
    return buffer;
  }
}
