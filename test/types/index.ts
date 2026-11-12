// Type-checked by `npm run test:types` (tsc), never run: the declarations in
// dist/useragent.d.ts against the ways the package is used.
// eslint-disable-next-line @typescript-eslint/no-require-imports -- a way the package is used
import useragent = require('../../dist/useragent');
import { Agent, Device, Os, fromJSON, parse } from '../../dist/useragent';

const agent: Agent = useragent.parse(
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1'
);
const family: string | null = agent.family;
const major: string | null = agent.major;
const source: string = agent.source;
const os: Os | null = agent.os;
const osFamily: string | null | undefined = os?.family;
const device: Device | null = agent.device;
const model: string | null | undefined = device?.model;
const type: string | null = agent.type;
const text: string = agent.toString() + agent.toVersion();
const agentText: string | null = agent.toAgent();
const osText: string | null | undefined = os?.toString();
const deviceText: string | null | undefined = device?.toString();

// Only the regex sets can be turned off.
parse('curl/8.0', true, false, false);

// The JSON form and back.
const json = agent.toJSON();
const again: Agent = fromJSON(json);
const fromString: Agent = fromJSON(JSON.stringify(json));

// Set by hand.
agent.os = new Os('iOS', '18', '1');
agent.device = new Device('iPhone', 'Apple', 'iPhone');
agent.type = 'browser';

useragent.addRegex('extra', {
  regex: '^ExampleBot/(\\d+)',
  family_replacement: 'ExampleBot',
  type_replacement: 'robot',
});

// @ts-expect-error parse needs a string (it throws on undefined).
parse(undefined);
// @ts-expect-error not a regex set.
useragent.addRegex('core', { regex: 'x' });
// @ts-expect-error the family can be null.
const notNull: string = agent.family;
// @ts-expect-error null when nothing was recognised.
parse('').toAgent().trim();
// @ts-expect-error null without a family.
new Os().toString().trim();
// @ts-expect-error null without a family.
new Device().toString().trim();

export {
  family,
  major,
  source,
  osFamily,
  model,
  type,
  text,
  agentText,
  osText,
  deviceText,
  again,
  fromString,
  notNull,
};
