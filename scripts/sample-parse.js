const fs = require('fs');
const path = require('path');

const { pick } = require('lodash');

const useragent = require('../src/useragent');
const { prettyJsonStringify } = require('../src/utils');

function parse(filename) {
  const uas = require(path.join(__dirname, '../data/sample', filename));

  const fields = ['family', 'major', 'minor', 'patch', 'patch_minor'];

  const parsedUas = {};

  for (const ua of uas) {
    const agent = useragent.parse(ua);

    parsedUas[ua] = pick(agent.toJSON(), fields);
  }

  const parsedFilename = path.join(
    __dirname,
    '../data/sample',
    filename.replace('.json', '-parsed.json')
  );

  // With a trailing newline, as Prettier writes it
  fs.writeFileSync(parsedFilename, `${prettyJsonStringify(parsedUas)}\n`);
}

fs.readdir(path.join(__dirname, '../data/sample'), (err, filenames) => {
  filenames.forEach((filename) => {
    if (filename.includes('.json') && !filename.includes('parsed')) {
      parse(filename);
    }
  });
});
