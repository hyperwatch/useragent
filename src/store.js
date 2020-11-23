const fs = require('fs');
const path = require('path');

const utils = require('./utils');

const { alphabeticalSort, prettyJsonStringify } = utils;

const uas = {};

function store(ua) {
  const date = new Date().toISOString().slice(0, 10);
  const filename = path.join(__dirname, '../data/store', `${date}.json`);
  if (uas[date] === undefined) {
    try {
      uas[date] = require(filename);
    } catch (err) {
      uas[date] = [];
    }
  }

  if (!uas[date].includes(ua)) {
    uas[date].push(ua);
    fs.writeFileSync(
      filename,
      prettyJsonStringify(uas[date].sort(alphabeticalSort))
    );
  }
}

module.exports = store;
