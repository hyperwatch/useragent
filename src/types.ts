/** A regex entry, as in `regexes/*.yml` (`regex` a string there, compiled when loaded). */
export interface RegexEntry<R = string> {
  regex: R;
  regex_flag?: string;
  family_replacement?: string;
  v1_replacement?: string;
  v2_replacement?: string;
  v3_replacement?: string;
  v4_replacement?: string;
  type_replacement?: string;
  os_replacement?: string;
  os_v1_replacement?: string;
  os_v2_replacement?: string;
  os_v3_replacement?: string;
  os_v4_replacement?: string;
  device_replacement?: string;
  brand_replacement?: string;
  model_replacement?: string;
}

/** A regex entry once loaded (`regexes/index.js`). */
export type CompiledRegex = RegexEntry<RegExp>;

/** The regex sets, as `regexes/index.js` loads them. */
export interface Regexes {
  first: CompiledRegex[];
  /** Hyperwatch's core regexes, by family (`src/preparser.ts` picks one). */
  core: Record<string, CompiledRegex[]>;
  extra: CompiledRegex[];
  uapCoreAgent: CompiledRegex[];
  uapCoreOs: CompiledRegex[];
  uapCoreDevice: CompiledRegex[];
}

/** The regex sets a regex can be added to (first in its set). */
export type RegexSet =
  'first' | 'extra' | 'uapCoreAgent' | 'uapCoreOs' | 'uapCoreDevice';
