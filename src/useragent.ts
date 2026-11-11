import debug from 'debug';

import { processFamily } from './mapping';
import * as preparser from './preparser';
import regexes from './regexes';
import store from './store';
import type * as types from './types';
import { replaceMatches } from './utils';

const debugUseragent = debug('hyperwatch:useragent');

// Named exports, each its own `exports.<name> =` line, so Node finds them when an ES module imports this CommonJS file
// (`import { parse } from '@hyperwatch/useragent'`); and a default export with the same, for `import useragent from`.
export type RegexEntry = types.RegexEntry;
export type RegexSet = types.RegexSet;

/** The JSON form of an `Os` (`Os#toJSON`). */
export interface OsJSON {
  family: string | null;
  major: string | null;
  minor: string | null;
  patch: string | null;
  patch_minor: string | null;
}

/** The JSON form of a `Device` (`Device#toJSON`). */
export interface DeviceJSON {
  family: string | null;
  brand: string | null;
  model: string | null;
}

/** The JSON form of an `Agent` (`Agent#toJSON`), as `fromJSON` takes it back. */
export interface AgentJSON {
  family: string | null;
  major: string | null;
  minor: string | null;
  patch: string | null;
  patch_minor: string | null;
  type?: string;
  os?: OsJSON;
  device?: DeviceJSON;
}

/** A parsed user agent. `os`, `device` and `type` are parsed on first read. */
export class Agent {
  /** The agent's name ("Firefox", "Googlebot"), or null when nothing matched. */
  family: string | null;
  major: string | null;
  minor: string | null;
  patch: string | null;
  patch_minor: string | null;
  /** The user agent string it was parsed from. */
  source: string;

  constructor(
    family?: string | null,
    major?: string | null,
    minor?: string | null,
    patch?: string | null,
    patch_minor?: string | null,
    source?: string | null
  ) {
    this.family = family || null;
    this.major = major || null;
    this.minor = minor || null;
    this.patch = patch || null;
    this.patch_minor = patch_minor || null;
    this.source = source || '';
  }

  /** The agent's type when a rule gives one ("robot"…), otherwise null. Can be set. */
  get type(): string | null {
    const device = this.device;

    return Object.defineProperty(this, 'type', {
      value: device && device.family === 'Spider' ? 'robot' : null,
    }).type;
  }

  /** Bypasses the on-demand parsing. */
  set type(type: string | null) {
    Object.defineProperty(this, 'type', {
      value: type,
    });
  }

  /** The operating system, or null when none was found. Can be set to an `Os`. */
  get os(): Os | null {
    const userAgent = this.source;

    for (const osRegex of regexes.uapCoreOs) {
      const res = osRegex.regex.exec(userAgent);
      if (res) {
        const family = osRegex.os_replacement
          ? replaceMatches(osRegex.os_replacement, res)
          : res[1];
        const major = osRegex.os_v1_replacement
          ? replaceMatches(osRegex.os_v1_replacement, res)
          : res[2];
        const minor = osRegex.os_v2_replacement
          ? replaceMatches(osRegex.os_v2_replacement, res)
          : res[3];
        const patch = osRegex.os_v3_replacement
          ? replaceMatches(osRegex.os_v3_replacement, res)
          : res[4];
        const patch_minor = osRegex.os_v4_replacement
          ? replaceMatches(osRegex.os_v4_replacement, res)
          : res[5];

        return Object.defineProperty(this, 'os', {
          value: new Os(family, major, minor, patch, patch_minor),
        }).os;
      }
    }

    return Object.defineProperty(this, 'os', {
      value: null,
    }).os;
  }

  /** Bypasses the on-demand parsing; anything but an `Os` is ignored. */
  set os(os: Os | null) {
    if (os instanceof Os) {
      Object.defineProperty(this, 'os', {
        value: os,
      });
    }
  }

  /** The device, or null when none was found. Can be set to a `Device`. */
  get device(): Device | null {
    const userAgent = this.source;

    for (const deviceRegex of regexes.uapCoreDevice) {
      const res = deviceRegex.regex.exec(userAgent);
      if (res) {
        const family = deviceRegex.device_replacement
          ? replaceMatches(deviceRegex.device_replacement, res)
          : res[1];
        const brand = deviceRegex.brand_replacement
          ? replaceMatches(deviceRegex.brand_replacement, res)
          : res[2];
        const model = deviceRegex.model_replacement
          ? replaceMatches(deviceRegex.model_replacement, res)
          : res[3];

        return Object.defineProperty(this, 'device', {
          value: new Device(family, brand, model),
        }).device;
      }
    }

    return Object.defineProperty(this, 'device', {
      value: null,
    }).device;
  }

  /** Bypasses the on-demand parsing; anything but a `Device` is ignored. */
  set device(device: Device | null) {
    if (device instanceof Device) {
      Object.defineProperty(this, 'device', {
        value: device,
      });
    }
  }

  /** "Firefox 82.0"; null when nothing was recognised (no family, no version). */
  toAgent(): string | null {
    const version = this.toVersion();

    // Without a family: null, or "null 1.0" with a version, as it always was.
    return version ? `${this.family} ${version}` : this.family;
  }

  /** "Firefox 82.0 / Mac OS X 10.15" ("null" when nothing was recognised). */
  toString(): string {
    const agent = this.toAgent();
    const os = this.os ? ` / ${this.os.toString()}` : '';

    return `${agent}${os}`;
  }

  /** "82.0", or "" without a major version. */
  toVersion(): string {
    let version = '';

    if (this.major) {
      version += this.major;

      if (this.minor) {
        version += `.${this.minor}`;

        // Special case here, the patch can also be Alpha, Beta etc so we need
        // to check if it's a string or not.
        if (this.patch) {
          version += (isNaN(+this.patch) ? ' ' : '.') + this.patch;

          if (this.patch_minor) {
            version += `.${this.patch_minor}`;
          }
        }
      }
    }

    return version;
  }

  toJSON(): AgentJSON {
    const object: AgentJSON = {
      family: this.family,
      major: this.major,
      minor: this.minor,
      patch: this.patch,
      patch_minor: this.patch_minor,
    };
    if (this.type) {
      object.type = this.type;
    }
    if (this.os) {
      object.os = this.os.toJSON();
    }
    if (this.device) {
      object.device = this.device.toJSON();
    }
    return object;
  }
}

/** A parsed operating system. */
export class Os {
  family: string | null;
  major: string | null;
  minor: string | null;
  patch: string | null;
  patch_minor: string | null;

  constructor(
    family?: string | null,
    major?: string | null,
    minor?: string | null,
    patch?: string | null,
    patch_minor?: string | null
  ) {
    this.family = family || null;
    this.major = major || null;
    this.minor = minor || null;
    this.patch = patch || null;
    this.patch_minor = patch_minor || null;
  }

  /** "Mac OS X 10.15.7"; null without a family. */
  toString(): string | null {
    const version = this.toVersion();

    // Without a family: null, or "null 1.0" with a version, as it always was.
    return version ? `${this.family} ${version}` : this.family;
  }

  /** "10.15.7", or "" without a major version. */
  toVersion(): string {
    let version = '';

    if (this.major) {
      version += this.major;

      if (this.minor) {
        version += `.${this.minor}`;

        // Special case here, the patch can also be Alpha, Beta etc so we need
        // to check if it's a string or not.
        if (this.patch) {
          version += (isNaN(+this.patch) ? ' ' : '.') + this.patch;
        }
      }
    }

    return version;
  }

  toJSON(): OsJSON {
    return {
      family: this.family,
      major: this.major || null,
      minor: this.minor || null,
      patch: this.patch || null,
      patch_minor: this.patch_minor || null,
    };
  }
}

/** A parsed device. */
export class Device {
  family: string | null;
  brand: string | null;
  model: string | null;

  constructor(
    family?: string | null,
    brand?: string | null,
    model?: string | null
  ) {
    this.family = family || null;
    this.brand = brand || null;
    this.model = model || null;
  }

  toString(): string | null {
    const version = this.toVersion();

    // Without a family: null, or "null 1.0" with a version, as it always was.
    return version ? `${this.family} ${version}` : this.family;
  }

  /**
   * A device has no version: always "". Kept as `Os#toVersion` is, for a
   * uniform interface.
   */
  toVersion(): string {
    return '';
  }

  toJSON(): DeviceJSON {
    return {
      family: this.family,
      brand: this.brand || null,
      model: this.model || null,
    };
  }
}

/**
 * Parses a user agent string. Each regex set can be turned off: Hyperwatch's
 * first and core regexes, its extra regexes, and UAP Core's agent regexes.
 */
export function parse(
  userAgent: string,
  enableCore = true,
  enableExtra = true,
  enableUapCore = true
): Agent {
  debugUseragent(userAgent);

  if (userAgent && userAgent.length > 1000) {
    userAgent = userAgent.substring(0, 1000);
  }

  if (process.env.HYPERWATCH_USERAGENT_STORE) {
    store(userAgent);
  }

  // Remove known artefacts
  userAgent = userAgent.replace(',gzip(gfe)', '');

  if (!userAgent || !isSafe(userAgent)) {
    return new Agent();
  }

  const regexSets: Record<string, types.CompiledRegex[]> = {};

  if (enableCore) {
    regexSets['hyperwatch-first'] = regexes.first;
    const result = preparser.parse(userAgent);
    if (result.meta) {
      debugUseragent(result.meta);
    }
    if (result.regexes) {
      regexSets['hyperwatch-core'] = result.regexes;
    }
  }
  if (enableExtra) {
    regexSets['hyperwatch-extra'] = regexes.extra;
  }
  if (enableUapCore) {
    regexSets['uap-core'] = regexes.uapCoreAgent;
  }

  for (const [setName, regexSet] of Object.entries(regexSets)) {
    for (const entry of regexSet) {
      const {
        regex,
        family_replacement,
        v1_replacement,
        v2_replacement,
        v3_replacement,
        v4_replacement,
        type_replacement,
      } = entry;

      const res = regex.exec(userAgent);
      if (res) {
        debugUseragent(regex);
        const family = processFamily(
          family_replacement ? replaceMatches(family_replacement, res) : res[1]
        );

        // Optimization: no need to replaceMatches in replacements
        const major = v1_replacement || res[2] || null;
        const minor = v2_replacement || res[3] || null;
        const patch = v3_replacement || res[4] || null;
        const minor_patch = v4_replacement || res[5] || null;

        const type = type_replacement || null;

        debugUseragent(`Result (${setName})`, {
          family,
          major,
          minor,
          patch,
          minor_patch,
        });

        const agent = new Agent(
          family,
          major,
          minor,
          patch,
          minor_patch,
          userAgent
        );

        if (type) {
          Object.defineProperty(agent, 'type', { value: type });
        }

        return agent;
      }
    }
  }

  debugUseragent('No result');

  // We might still be able to parse the os and device,
  // so make sure we supply it with the source
  return new Agent(null, null, null, null, null, userAgent);
}

/** An `Agent` back from its JSON form (an object, or its string). */
export function fromJSON(details: AgentJSON | string): Agent {
  if (typeof details === 'string') {
    details = JSON.parse(details) as AgentJSON;
  }

  const agent = new Agent(
    details.family,
    details.major,
    details.minor,
    details.patch,
    details.patch_minor
  );

  if (details.type) {
    agent.type = details.type;
  }

  if (details.os) {
    agent.os = new Os(
      details.os.family,
      details.os.major,
      details.os.minor,
      details.os.patch,
      details.os.patch_minor
    );
  }

  if (details.device) {
    agent.device = new Device(
      details.device.family,
      details.device.brand,
      details.device.model
    );
  }

  return agent;
}

/** Adds a regex at the start of a set. */
export function addRegex(type: RegexSet, object: RegexEntry): void {
  const compiled: types.CompiledRegex = {
    ...object,
    regex: new RegExp(object.regex, object.regex_flag || ''),
  };
  // The same object, as before: a caller keeping it sees the compiled regex.
  Object.assign(object, compiled);
  regexes[type].unshift(object as unknown as types.CompiledRegex);
}

/**
 * Whether the user agent is something we want to parse with regexps (not too
 * long, no run of 100 letters, digits or spaces).
 */
function isSafe(userAgent: string): boolean {
  let consecutive = 0;

  if (userAgent.length > 1000) {
    return false;
  }

  for (let i = 0; i < userAgent.length; i++) {
    const code = userAgent.charCodeAt(i);
    if (
      (code >= 48 && code <= 57) || // numbers
      (code >= 65 && code <= 90) || // letters A-Z
      (code >= 97 && code <= 122) || // letters a-z
      code <= 32 // spaces and control
    ) {
      consecutive++;
    } else {
      consecutive = 0;
    }

    if (consecutive >= 100) {
      return false;
    }
  }

  return true;
}

export default { Agent, Os, Device, parse, fromJSON, addRegex };
