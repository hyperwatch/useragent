// Type definitions for @hyperwatch/useragent (src/useragent.js).

declare namespace useragent {
  /** The JSON form of an `Os` (`Os#toJSON`). */
  interface OsJSON {
    family: string | null;
    major: string | null;
    minor: string | null;
    patch: string | null;
    patch_minor: string | null;
  }

  /** The JSON form of a `Device` (`Device#toJSON`). */
  interface DeviceJSON {
    family: string | null;
    brand: string | null;
    model: string | null;
  }

  /** The JSON form of an `Agent` (`Agent#toJSON`), as `fromJSON` takes it back. */
  interface AgentJSON {
    family: string | null;
    major: string | null;
    minor: string | null;
    patch: string | null;
    patch_minor: string | null;
    type?: string;
    os?: OsJSON;
    device?: DeviceJSON;
  }

  /** A parsed operating system. */
  class Os {
    constructor(
      family?: string | null,
      major?: string | null,
      minor?: string | null,
      patch?: string | null,
      patch_minor?: string | null
    );
    family: string | null;
    major: string | null;
    minor: string | null;
    patch: string | null;
    patch_minor: string | null;
    /** "Mac OS X 10.15.7" */
    toString(): string;
    /** "10.15.7", or "" without a major version. */
    toVersion(): string;
    toJSON(): OsJSON;
  }

  /** A parsed device. */
  class Device {
    constructor(
      family?: string | null,
      brand?: string | null,
      model?: string | null
    );
    family: string | null;
    brand: string | null;
    model: string | null;
    toString(): string;
    toVersion(): string;
    toJSON(): DeviceJSON;
  }

  /** A parsed user agent. `os`, `device` and `type` are parsed on first read. */
  class Agent {
    constructor(
      family?: string | null,
      major?: string | null,
      minor?: string | null,
      patch?: string | null,
      patch_minor?: string | null,
      source?: string | null
    );
    /** The agent's name ("Firefox", "Googlebot"), or null when nothing matched. */
    family: string | null;
    major: string | null;
    minor: string | null;
    patch: string | null;
    patch_minor: string | null;
    /** The user agent string it was parsed from. */
    source: string;
    /** The agent's type when a rule gives one ("robot"…), otherwise null. Can be set. */
    type: string | null;
    /** The operating system, or null when none was found. Can be set to an `Os`. */
    os: Os | null;
    /** The device, or null when none was found. Can be set to a `Device`. */
    device: Device | null;
    /** "Firefox 82.0" */
    toAgent(): string;
    /** "Firefox 82.0 / Mac OS X 10.15" */
    toString(): string;
    /** "82.0", or "" without a major version. */
    toVersion(): string;
    toJSON(): AgentJSON;
  }

  /** A regex entry, as in `regexes/*.yml`: `regex` is compiled by `addRegex`. */
  interface RegexEntry {
    regex: string;
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

  /** The regex sets a regex can be added to (first in its set). */
  type RegexSet =
    'first' | 'extra' | 'uapCoreAgent' | 'uapCoreOs' | 'uapCoreDevice';

  /**
   * Parses a user agent string. Each regex set can be turned off: Hyperwatch's
   * first and core regexes, its extra regexes, and UAP Core's agent regexes.
   */
  function parse(
    userAgent: string,
    enableCore?: boolean,
    enableExtra?: boolean,
    enableUapCore?: boolean
  ): Agent;

  /** An `Agent` back from its JSON form (an object, or its string). */
  function fromJSON(details: AgentJSON | string): Agent;

  /** Adds a regex at the start of a set. */
  function addRegex(type: RegexSet, object: RegexEntry): void;
}

export = useragent;
