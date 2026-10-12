# Changelog

Releases are also on [GitHub](https://github.com/hyperwatch/useragent/releases). Versions before 4.0.0 have no entry: see the git history.

## 4.0.1 (2026-10-09)

Two parsing fixes for iOS user agents. No API changes.

### Edge for iOS with `Version/` after the agent ([#221](https://github.com/hyperwatch/useragent/pull/221))

Newer Edge for iOS user agents put `Version/` after `EdgiOS/`. They were parsed as `Version`:

    … (KHTML, like Gecko) EdgiOS/153.0.4234.46 Version/26.0 Mobile/15E148 Safari/604.1
    before: Version 26    after: Edge 153

The older order (`Version/13.0 EdgiOS/45.3.19 Mobile/…`) still parses as Edge, and Safari is unaffected.

### iOS apps with a `[Name]/version` suffix ([#223](https://github.com/hyperwatch/useragent/pull/223))

`Mobile/<build> [Name]/<version>` user agents were parsed as `Safari WebView`:

    … Mobile/15E148 [LinkedInApp]/9.32.4348.2
    before: Safari WebView    after: LinkedInApp 9.32.4348.2

`[Name]` without a version is parsed as before.

## 4.0.0 (2026-10-05)

### Breaking

- **Node.js 24 or later** (`engines` was `>=12.0`). Tested on 24 and 26. ([#218](https://github.com/hyperwatch/useragent/pull/218))
- **The package only contains what `parse()` loads:** `src`, `regexes/index.js` and `regexes/*.json`. The tests, scripts, the `.yml` regex sources and `data/` are no longer published, so anything that required them from the package will break. The tarball went from ~97 kB to 44 kB. ([#219](https://github.com/hyperwatch/useragent/pull/219))

### Parsing

- **UAP Core regexes updated** to ua-parser/uap-core of 2026-08-24, the first update since June 2023. UAP Core is the fallback for agents and the only parser for OS and devices. ([#217](https://github.com/hyperwatch/useragent/pull/217)) New agents it recognises:
  - AOL Desktop Gold Browser, HiBrowser and Chromium GOST Browser (were Chrome)
  - Weibo (was Safari WebView)
  - PetalBot: OS `Other`, device `Spider`
  - Meta Quest 3: OS `Android`, device `Quest`
- **A name followed by a hex id** is read as the name, not as a version or part of the name. For example, `amazon-Quick-on-behalf-of-81209fb7` is now `amazon-Quick-on-behalf-of`. The id can be 8 hex characters with at least one letter, or a UUID. Date versions such as `-20201231` are still versions. ([#216](https://github.com/hyperwatch/useragent/pull/216))
- **New generic rules** for user agents that had no family ([#220](https://github.com/hyperwatch/useragent/pull/220)):
  - `PayPal/AUHD-1.0-1` → PayPal 1.0
  - `Mozilla/5.0 (Windows NT 10.0; Win64; x64) Xorxer/1.0` → Xorxer 1.0
  - `Misskey/Sharkey-2025.5.2-…` → Misskey 2025.5.2

### Tooling

- ESLint 10 with a flat config, husky 9, lint-staged 17, mocha 12, prettier 3.9, and current debug and lodash. `node-fetch` was removed: `scripts/update.js` uses the built-in `fetch`. ([#218](https://github.com/hyperwatch/useragent/pull/218))
- New tests for OS and device parsing, and for the agents the UAP update changed. ([#220](https://github.com/hyperwatch/useragent/pull/220))
