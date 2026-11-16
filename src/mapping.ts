interface Mapping {
  familyMapping: Record<string, string>;
  uapCorefamilyMapping: Record<string, string>;
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mapping = require('../regexes/mapping.json') as Mapping;

export function processFamily(family: string): string {
  family = family.replace(/_|\//g, ' ');
  return (
    mapping.familyMapping[family] ||
    mapping.uapCorefamilyMapping[family] ||
    family
  );
}
