export function alphabeticalSort(a: string, b: string): number {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

export function average(nums: number[]): number {
  return nums.reduce((a, b) => a + b) / nums.length;
}

export function formatPercentage(value: number): number {
  return Number((100 * value).toPrecision(2));
}

export function formatWithPrecision(value: number, precision = 3): number {
  return Number(value.toPrecision(precision));
}

export function prettyJsonStringify(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function replaceMatches(string: string, res: RegExpExecArray): string {
  return string
    .replace('$1', res[1])
    .replace('$2', res[2])
    .replace('$3', res[3])
    .replace('$4', res[4]);
}

export function shuffle<T>(array: T[]): T[] {
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
