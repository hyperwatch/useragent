const mapping = require('../regexes/mapping.json');

function processFamily(family) {
  family = family.replace(/_|\//g, ' ');
  return (
    mapping.familyMapping[family] ||
    mapping.uapCorefamilyMapping[family] ||
    family
  );
}

exports.processFamily = processFamily;
