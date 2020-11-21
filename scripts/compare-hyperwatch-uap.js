const path = require('path');

const useragent = require('../src/useragent');

const month = new Date().toISOString().slice(0, 7);

const filename = path.join(
  __dirname,
  '../data/sample',
  `opencollective-${month}-parsed.json`
);

let uas;
try {
  uas = require(filename);
} catch (err) {
  uas = [];
}

// Transform Hyperwatch to their UAP Core equivalent
const mapping = {
  'Coc Coc Browser': 'Coc Coc',
  'Coc Coc Bot Image': 'Coc Coc Bot',
  'Coc Coc Bot Web': 'Coc Coc Bot',
  'DuckDuckBot-Https': 'DuckDuckBot',
  'Google Search App': 'Google',
  'Mobile Safari UI/WKWebView': 'Safari WebView',
  'Chrome Mobile WebView': 'Chrome WebView',
  'Mobile Safari': 'Safari Mobile',
  'WordPress.com': 'WordPress',
  'python-requests': 'Python Requests',
  'Android WebView': 'Android',
  PaleMoon: 'Pale Moon',
};

// Transform UAP Core to their Hyperwatch equivalent
const uapCoreMapping = {
  'Chrome Mobile WebView': 'Chrome WebView',
  'Chrome Mobile': 'Chrome',
  'Edge Mobile': 'Edge',
  'Firefox Alpha': 'Firefox',
  'Firefox Beta': 'Firefox',
  'Firefox Mobile': 'Firefox',
  'Mail.RU_Bot': 'Mail.RU Bot',
  'Opera Mobile': 'Opera',
  'Samsung Internet': 'SamsungBrowser',
  bingbot: 'BingBot',
  coccocbot: 'Coc Coc Bot',
  GmailImageProxy: 'GoogleImageProxy',
  LINE: 'Line',
  'Chrome Mobile iOS': 'Chrome',
  'QQ Browser': 'QQBrowser',
  'UC Browser': 'UCBrowser',
  'Firefox iOS': 'Firefox',
  'QQ Browser Mobile': 'QQBrowser',
  'Sailfish Browser': 'SailfishBrowser',
};

for (const [ua, json] of Object.entries(uas)) {
  if (!json) {
    continue;
  }
  if (!json.family) {
    console.log(`No result`, { hyperwatch: null }, ua);
    continue;
  }

  // Transform Hyperwatch to their UAP Core equivalent
  if (json.family && mapping[json.family]) {
    json.family = mapping[json.family];
  }

  // Parse with UAP core only
  const agent = useragent.parse(
    ua,
    /* enableCore */ false,
    /* enableExtra */ false,
    /* enableUapCore */ true
  );
  const result = agent.toJSON();

  // Transform UAP Core result to its Hyperwatch equivalent
  if (result.family && uapCoreMapping[result.family]) {
    result.family = uapCoreMapping[result.family];
  }

  if (!result.family) {
    // console.log(`New:`, { hyperwatch: json.family });
    continue;
  }

  if (result.family !== json.family) {
    console.log('Diff', { uap: result.family, hyperwatch: json.family });
  }
}
