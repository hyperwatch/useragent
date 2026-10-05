const assert = require('assert');

const useragent = require('../../src/useragent');

const tests = require('./useragent-os-device.json');

describe('useragent os and device', () => {
  for (const [ua, json] of tests) {
    it(`should parse the os and device of ${ua}`, () => {
      const agent = useragent.parse(ua);
      assert.deepStrictEqual(
        { os: agent.os.toJSON(), device: agent.device.toJSON() },
        json
      );
    });
  }
});
