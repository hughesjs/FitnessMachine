import 'package:flutter_test/flutter_test.dart';
import 'package:fitness_machine/hardware/ble/models/supported_speed_range.dart';

void main() {
  group("supported speed range parsing", () {
    test("1-6km at 0.5kmh increments", () {
      var data = [0x64, 0x00, 0x58, 0x02, 0x32, 0x00];
      var res = SupportedSpeedRange.fromBytes(data);
      expect(res.minSpeedInKmh, 1);
      expect(res.maxSpeedInKmh, 6);
      expect(res.minIncrementInKmh, 0.5);
    });
  });
}
