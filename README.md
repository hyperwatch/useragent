[![NPM version](https://img.shields.io/npm/v/@hyperwatch/useragent)](https://www.npmjs.com/package/@hyperwatch/useragent) [![Build Status](https://github.com/hyperwatch/useragent/workflows/CI/badge.svg)](https://github.com/hyperwatch/useragent/actions?query=workflow%3ACI)

This is Hyperwatch's User Agent parser for Node.js.

It's fast and detect more user agents that any other similar libraries.

It's derived from [UAP Core](https://github.com/ua-parser/uap-core) and forked from [3rd-Eden useragent](https://github.com/3rd-Eden/useragent).

Its using an innovative approach, it doesn't try to target each known user agent but instead target generic patterns. It allows the library to be more exhaustive, it doesn't need to contain a single rule for each user agent and it doesn't need to be updated each time there is a new active user agent in the wild.

It's much faster because it's containing less regexes than predecessors, it's starting with a plain text "pre-parsing" to lower even more the number of regexes to execute.

## Install

```bash
npm install --save @hyperwatch/useragent
```

## Usage

In short:

```js
const useragent = require('@hyperwatch/useragent');

const agent = useragent.parse(
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:82.0) Gecko/20100101 Firefox/82.0'
);

console.log(agent);
```

Returns:

```js
{
  family: 'Firefox',
  major: '82',
  minor: '0',
  patch: null,
  patch_minor: null,
  source: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:82.0) Gecko/20100101 Firefox/82.0'
}
```

For more details, [read the dedicated API documentation](docs/API.md).

## Regexes

### First

This set contains today 2 regular expressions.

It aims to contain generic regexes that can parse enough user agents that it's justified to run them every single time as first.

### Core

This set contains today around 90 regular expression in 20 families.

A plain text pre-parser is triggered first to recognize the user agent family, it then iterates over all regexes in the family, order matters.

### Extra

This set contains non-generic regexes targeting user agents that are not recognized by the 'First' or 'Core' sets. Sometimes it's acceptable to fallback on 'UAP' instead of adding a rule in 'Extra'. We're usually adding rules in 'Extra' for the following reasons:

- for coverage: to increase the success rate of our own Hyperwatch regex sets
- for performance: because it's faster to skip UAP and use our own Hyperwatch regex sets
- because it's not supported by UAP anyway

### UAP

If it's not able to provide a result with the 'First', 'Core' and 'Extra' sets, it uses UAP as a fallback.

Also, it's still using UAP for Device and OS parsing as this is not a focus of the library at this time.

## License

[Apache License, version 2](LICENSE)
