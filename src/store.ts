import * as fs from 'node:fs';
import * as path from 'node:path';

import { alphabeticalSort, prettyJsonStringify } from './utils';

const uas: Record<string, string[]> = {};

function store(ua: string): void {
  const date = new Date().toISOString().slice(0, 10);
  const filename = path.join(__dirname, '../data/store', `${date}.json`);
  if (uas[date] === undefined) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      uas[date] = require(filename) as string[];
    } catch {
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

export default store;
