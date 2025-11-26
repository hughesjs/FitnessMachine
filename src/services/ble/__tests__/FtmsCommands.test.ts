import {
  buildRequestControlCommand,
  buildResetCommand,
  buildSetTargetSpeedCommand,
  buildStartCommand,
  buildStopCommand,
  buildPauseCommand,
  buildSetTargetDistanceCommand,
  buildSetTargetTimeCommand,
  buildSetTargetStepsCommand,
  parseControlPointResponse,
} from '../FtmsCommands';
import {FtmsOpcodes, StopPauseParams} from '../constants';

describe('FtmsCommands', () => {
  describe('buildRequestControlCommand', () => {
    it('builds correct command', () => {
      const command = buildRequestControlCommand();

      expect(command).toEqual(new Uint8Array([FtmsOpcodes.REQUEST_CONTROL]));
    });
  });

  describe('buildResetCommand', () => {
    it('builds correct command', () => {
      const command = buildResetCommand();

      expect(command).toEqual(new Uint8Array([FtmsOpcodes.RESET]));
    });
  });

  describe('buildSetTargetSpeedCommand', () => {
    it('builds command for 5.00 km/h', () => {
      const command = buildSetTargetSpeedCommand(5.0);

      // 5.00 km/h = 500 units (0x01F4)
      expect(command).toEqual(
        new Uint8Array([FtmsOpcodes.SET_TARGET_SPEED, 0xf4, 0x01]),
      );
    });

    it('builds command for 10.50 km/h', () => {
      const command = buildSetTargetSpeedCommand(10.5);

      // 10.50 km/h = 1050 units (0x041A)
      expect(command).toEqual(
        new Uint8Array([FtmsOpcodes.SET_TARGET_SPEED, 0x1a, 0x04]),
      );
    });

    it('builds command for 0 km/h', () => {
      const command = buildSetTargetSpeedCommand(0);

      expect(command).toEqual(
        new Uint8Array([FtmsOpcodes.SET_TARGET_SPEED, 0x00, 0x00]),
      );
    });

    it('rounds to nearest 0.01 km/h', () => {
      const command = buildSetTargetSpeedCommand(5.555);

      // Should round to 556 (0x022C)
      expect(command).toEqual(
        new Uint8Array([FtmsOpcodes.SET_TARGET_SPEED, 0x2c, 0x02]),
      );
    });
  });

  describe('buildStartCommand', () => {
    it('builds correct command', () => {
      const command = buildStartCommand();

      expect(command).toEqual(new Uint8Array([FtmsOpcodes.START_OR_RESUME]));
    });
  });

  describe('buildStopCommand', () => {
    it('builds correct command with stop parameter', () => {
      const command = buildStopCommand();

      expect(command).toEqual(
        new Uint8Array([FtmsOpcodes.STOP_OR_PAUSE, StopPauseParams.STOP]),
      );
    });
  });

  describe('buildPauseCommand', () => {
    it('builds correct command with pause parameter', () => {
      const command = buildPauseCommand();

      expect(command).toEqual(
        new Uint8Array([FtmsOpcodes.STOP_OR_PAUSE, StopPauseParams.PAUSE]),
      );
    });
  });

  describe('buildSetTargetDistanceCommand', () => {
    it('builds command for 1500 meters', () => {
      const command = buildSetTargetDistanceCommand(1500);

      // 1500 = 0x0005DC
      expect(command).toEqual(
        new Uint8Array([FtmsOpcodes.SET_TARGET_DISTANCE, 0xdc, 0x05, 0x00]),
      );
    });

    it('builds command for large distance', () => {
      const command = buildSetTargetDistanceCommand(100000);

      // 100000 = 0x0186A0
      expect(command).toEqual(
        new Uint8Array([FtmsOpcodes.SET_TARGET_DISTANCE, 0xa0, 0x86, 0x01]),
      );
    });
  });

  describe('buildSetTargetTimeCommand', () => {
    it('builds command for 30 minutes', () => {
      const command = buildSetTargetTimeCommand(1800);

      // 1800 = 0x0708
      expect(command).toEqual(
        new Uint8Array([FtmsOpcodes.SET_TARGET_TRAINING_TIME, 0x08, 0x07]),
      );
    });

    it('builds command for 1 hour', () => {
      const command = buildSetTargetTimeCommand(3600);

      // 3600 = 0x0E10
      expect(command).toEqual(
        new Uint8Array([FtmsOpcodes.SET_TARGET_TRAINING_TIME, 0x10, 0x0e]),
      );
    });
  });

  describe('buildSetTargetStepsCommand', () => {
    it('builds command for 5000 steps', () => {
      const command = buildSetTargetStepsCommand(5000);

      // 5000 = 0x1388
      expect(command).toEqual(
        new Uint8Array([FtmsOpcodes.SET_TARGET_STEPS, 0x88, 0x13]),
      );
    });
  });

  describe('parseControlPointResponse', () => {
    it('parses valid response', () => {
      const data = new Uint8Array([0x80, 0x02, 0x01]); // Response, SET_TARGET_SPEED, SUCCESS

      const result = parseControlPointResponse(data);

      expect(result).toEqual({
        opcode: 0x80,
        requestOpcode: 0x02,
        resultCode: 0x01,
      });
    });

    it('returns null for insufficient bytes', () => {
      const data = new Uint8Array([0x80, 0x02]);

      const result = parseControlPointResponse(data);

      expect(result).toBeNull();
    });

    it('returns null for invalid opcode', () => {
      const data = new Uint8Array([0x01, 0x02, 0x01]); // Not a response

      const result = parseControlPointResponse(data);

      expect(result).toBeNull();
    });
  });
});
