import type { Regexes } from './types';

// The regexes, compiled by regexes/index.js (JavaScript, published as it is: `npm run update` regenerates the JSON
// next to it).
// eslint-disable-next-line @typescript-eslint/no-require-imports
const regexes = require('../regexes') as Regexes;

export default regexes;
