const fs = require('fs');
const path = require('path');

const fetch = require('node-fetch'); // eslint-disable-line node/no-unpublished-require
const yaml = require('yamlparser'); // eslint-disable-line node/no-unpublished-require

const { prettyJsonStringify } = require('../src/utils');

fetch(
  'https://raw.githubusercontent.com/ua-parser/uap-core/master/regexes.yaml'
)
  .then((response) => response.text())

  .then((regexesYaml) => {
    fs.writeFileSync(
      path.resolve(__dirname, '..', 'regexes', 'uap-core.yml'),
      regexesYaml
    );

    const regexesFirstYaml = fs
      .readFileSync(path.resolve(__dirname, '..', 'regexes', 'first.yml'))
      .toString();

    const regexesExtraYaml = fs
      .readFileSync(path.resolve(__dirname, '..', 'regexes', 'extra.yml'))
      .toString();

    const regexes = yaml.eval(regexesYaml);
    const regexesExtra = yaml.eval(regexesExtraYaml);
    const regexesFirst = yaml.eval(regexesFirstYaml);

    fs.writeFileSync(
      path.resolve(__dirname, '..', 'regexes', 'first.json'),
      prettyJsonStringify(regexesFirst.user_agent_parsers)
    );

    fs.writeFileSync(
      path.resolve(__dirname, '..', 'regexes', 'extra.json'),
      prettyJsonStringify(regexesExtra.user_agent_parsers)
    );

    fs.writeFileSync(
      path.resolve(__dirname, '..', 'regexes', 'uap-core-agent.json'),
      prettyJsonStringify(regexes.user_agent_parsers)
    );

    fs.writeFileSync(
      path.resolve(__dirname, '..', 'regexes', 'uap-core-os.json'),
      prettyJsonStringify(regexes.os_parsers)
    );

    fs.writeFileSync(
      path.resolve(__dirname, '..', 'regexes', 'uap-core-device.json'),
      prettyJsonStringify(regexes.device_parsers)
    );

    const regexesCoreYaml = fs
      .readFileSync(path.resolve(__dirname, '..', 'regexes', 'core.yml'))
      .toString();

    const regexesCore = yaml.eval(regexesCoreYaml);

    fs.writeFileSync(
      path.resolve(__dirname, '..', 'regexes', 'core.json'),
      prettyJsonStringify(regexesCore)
    );
  });
