function replaceMatches(string, res) {
  return string
    .replace('$1', res[1])
    .replace('$2', res[2])
    .replace('$3', res[3])
    .replace('$4', res[4]);
}

function alphabeticalSort(a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

function prettyJsonStringify(value) {
  return JSON.stringify(value, null, 2);
}

module.exports = { replaceMatches, alphabeticalSort, prettyJsonStringify };
