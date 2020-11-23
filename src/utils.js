function alphabeticalSort(a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

function average(nums) {
  return nums.reduce((a, b) => a + b) / nums.length;
}

function formatPercentage(value) {
  return Number((100 * value).toPrecision(2));
}

function formatWithPrecision(value, precision = 3) {
  return Number(value.toPrecision(precision));
}

function prettyJsonStringify(value) {
  return JSON.stringify(value, null, 2);
}

function replaceMatches(string, res) {
  return string
    .replace('$1', res[1])
    .replace('$2', res[2])
    .replace('$3', res[3])
    .replace('$4', res[4]);
}

function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports = {
  alphabeticalSort,
  average,
  formatPercentage,
  formatWithPrecision,
  prettyJsonStringify,
  replaceMatches,
  shuffle,
};
