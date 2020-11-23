const fs = require('fs');
const path = require('path');

const benchmarkResults = require('../data/benchmark-results.json');
const useragent = require('../src/useragent');
const {
  average,
  formatPercentage,
  formatWithPrecision,
  shuffle,
  prettyJsonStringify,
} = require('../src/utils');

function benchmarkSample(filename) {
  let uas;
  try {
    uas = require(path.join(__dirname, '../data/sample', filename));
  } catch (err) {
    uas = [];
  }

  const uasList = Object.keys(uas);
  shuffle(uasList);
  // Warm everything
  for (const ua of uasList) {
    useragent.parse(ua, true, true, true);
  }

  const benchmarkId = filename.replace('-parsed.json', '');
  benchmarkResults[benchmarkId] = benchmarkResults[benchmarkId] || {};

  const total = Object.keys(uas).length;
  benchmarkResults[benchmarkId]['total'] = total;

  const hyperwatchBenchmark = {},
    uapBenchmark = {},
    combinedBenchmark = {};
  const hyperwatchMisses = [],
    uapMisses = [],
    combinedMisses = [];

  for (const ua of uasList) {
    const combinedStart = process.hrtime.bigint();
    const combinedResult = useragent.parse(ua, true, true, true);
    const combinedEnd = process.hrtime.bigint();
    if (!combinedResult.family) {
      combinedMisses.push(ua);
    }
    combinedBenchmark[ua] = Number(combinedEnd - combinedStart) / 1000 / 1000;

    const hyperwatchStart = process.hrtime.bigint();
    const hyperwatchResult = useragent.parse(ua, true, true, false);
    const hyperwatchEnd = process.hrtime.bigint();
    if (!hyperwatchResult.family) {
      hyperwatchMisses.push(ua);
    }
    hyperwatchBenchmark[ua] =
      Number(hyperwatchEnd - hyperwatchStart) / 1000 / 1000;

    const uapStart = process.hrtime.bigint();
    const uapResult = useragent.parse(ua, false, false, true);
    const uapEnd = process.hrtime.bigint();
    if (!uapResult.family) {
      uapMisses.push(ua);
    }
    uapBenchmark[ua] = Number(uapEnd - uapStart) / 1000 / 1000;
  }

  benchmarkResults[benchmarkId]['hyperwatch'] = {
    average: formatWithPrecision(average(Object.values(hyperwatchBenchmark))),
    miss: hyperwatchMisses.length,
    missPercentage: formatPercentage(hyperwatchMisses.length / total),
  };

  benchmarkResults[benchmarkId]['uap'] = {
    average: formatWithPrecision(average(Object.values(uapBenchmark))),
    miss: uapMisses.length,
    missPercentage: formatPercentage(uapMisses.length / total),
  };

  benchmarkResults[benchmarkId]['combined'] = {
    average: formatWithPrecision(average(Object.values(combinedBenchmark))),
    miss: combinedMisses.length,
    missPercentage: formatPercentage(combinedMisses.length / total),
  };

  fs.writeFileSync(
    path.join(__dirname, '../data', 'benchmark-results.json'),
    prettyJsonStringify(benchmarkResults)
  );
}

fs.readdir(path.join(__dirname, '../data/sample'), (err, filenames) => {
  filenames.forEach((filename) => {
    if (filename.includes('parsed')) {
      benchmarkSample(filename);
    }
  });
});
