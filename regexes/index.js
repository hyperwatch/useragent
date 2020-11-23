const { mapValues } = require('lodash');

const coreRegexes = require('./core');
const extraRegexes = require('./extra');
const firstRegexes = require('./first');
const uapCoreAgentRegexes = require('./uap-core-agent');
const uapCoreDeviceRegexes = require('./uap-core-device');
const uapCoreOsRegexes = require('./uap-core-os');

function compileRegex(entry) {
  entry.regex = new RegExp(entry.regex, entry.regex_flag || '');
  return entry;
}

module.exports = {
  uapCoreAgent: uapCoreAgentRegexes.map(compileRegex),
  uapCoreDevice: uapCoreDeviceRegexes.map(compileRegex),
  uapCoreOs: uapCoreOsRegexes.map(compileRegex),
  extra: extraRegexes.map(compileRegex),
  first: firstRegexes.map(compileRegex),
  core: mapValues(coreRegexes, (regexes) => regexes.map(compileRegex)),
};
