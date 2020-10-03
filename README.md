[![NPM version](https://img.shields.io/npm/v/@hyperwatch/useragent)](https://www.npmjs.com/package/@hyperwatch/useragent) [![Build Status](https://github.com/hyperwatch/useragent/workflows/CI/badge.svg)](https://github.com/hyperwatch/useragent/actions?query=workflow%3ACI) [![Dependency Status](https://david-dm.org/hyperwatch/useragent.svg)](https://david-dm.org/hyperwatch/useragent)

This is Hyperwatch's User Agent parser for Node.js. It's fast and detect more user agents that any other similar libraries.

Forked from https://github.com/3rd-Eden/useragent. It's inspired from [UAP Core](https://github.com/ua-parser/uap-core) and still use it as a last option to process some edge cases.

It's faster because it's containing less regexes than predecessors, and it's starting with a plain text pre-parsing to lower even more the number of regexes to execute.

It's more exhaustive because it doesn't try to target each known user agent but instead target generic patterns. In most cases, it doesn't need to be updated each time there is a new user agent discovered.

## Install

```bash
npm install --save  @hyperwatch/useragent
```

## Regexes

### First

This set aims to contain generic regexes that can parse enough user agents that it's justified to run them as first.

It contains today 1 regular expression.

### Core

This set contains today around 90 regular expression in 20 families.

A plain text pre-parser is triggered first to recognize the user agent family, we then iterate of all regexes in the family, order matters.

### Extra

This set contains non-generic regexes targetting user agents that are not recognized by the generic one. Sometimes it's acceptable to go to fallback on the Uap Core instead. We're adding rules in extra for the following reasons:

- for coverage: to increase the success rate of our own regex set
- for performance: because it's faster to skip Uap Core and use our own regex set
- because it's not supported by UAP Core anyway

### UAP

We're still using UAP for Device and OS parsing as this is not a focus of the library at this time.

If we're not able to provide a result, we use UAP as a fallback in our default configuration.

## License

[Apache License, version 2](LICENSE)
