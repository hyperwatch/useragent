const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { isDeepStrictEqual } = require('util');

const { pick } = require('lodash');

const useragent = require('../../src/useragent');

// Every user agent of data/sample/<name>.json must still parse as recorded in
// <name>-parsed.json. After an intended change (a new rule, a UAP update),
// regenerate the recorded results with `node scripts/sample-parse.js` and
// review their diff.

const dir = path.join(__dirname, '../../data/sample');
const fields = ['family', 'major', 'minor', 'patch', 'patch_minor'];
const shown = 20;

const samples = fs
  .readdirSync(dir)
  .filter((filename) => filename.endsWith('.json'))
  .filter((filename) => !filename.endsWith('-parsed.json'));

const describeResult = (result) =>
  result
    ? [result.family, result.major, result.minor, result.patch]
        .filter((value) => value !== null && value !== undefined)
        .join(' ') || '(empty)'
    : '(not recorded)';

describe('samples', () => {
  it('has samples', () => {
    assert.ok(samples.length > 0);
  });

  for (const filename of samples) {
    const name = filename.replace('.json', '');

    it(`parses data/sample/${filename} as recorded in ${name}-parsed.json`, () => {
      const recordedFile = path.join(dir, `${name}-parsed.json`);
      assert.ok(
        fs.existsSync(recordedFile),
        `missing ${name}-parsed.json: run node scripts/sample-parse.js`
      );
      const uas = JSON.parse(fs.readFileSync(path.join(dir, filename), 'utf8'));
      const recorded = JSON.parse(fs.readFileSync(recordedFile, 'utf8'));

      const changed = [];
      for (const ua of uas) {
        const result = pick(useragent.parse(ua).toJSON(), fields);
        if (!isDeepStrictEqual(result, recorded[ua])) {
          changed.push(
            `  ${ua}\n    recorded: ${describeResult(recorded[ua])}\n    now:      ${describeResult(result)}`
          );
        }
      }

      const more =
        changed.length > shown
          ? `\n  … and ${changed.length - shown} more`
          : '';
      assert.ok(
        changed.length === 0,
        [
          `${changed.length} of ${uas.length} user agents in ${filename} no longer parse as recorded`,
          '(run node scripts/sample-parse.js if intended):',
          `${changed.slice(0, shown).join('\n')}${more}`,
        ].join('\n')
      );
    });
  }
});
