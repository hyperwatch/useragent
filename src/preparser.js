const regexes = require('../regexes');

function parse(ua) {
  if (ua.startsWith('Mozilla/5')) {
    return parseMozilla5(ua);
  } else if (ua.startsWith('Mozilla/4')) {
    return parseMozilla4(ua);
  } else if (ua.includes('Opera/')) {
    return parseOpera(ua);
  } else {
    return parseGeneric(ua);
  }
}

// Used by parse()

function parseMozilla5(ua) {
  if (ua.includes('Trident/')) {
    return parseTrident(ua);
  } else if (ua.includes('compatible')) {
    return parseMozilla5Compatible(ua);
  } else if (ua.includes(' +http') || ua.includes(' http')) {
    return parseMozilla5Url(ua);
  } else if (ua.includes('AppleWebKit/537.36')) {
    return parseGenericWebkit(ua);
  } else if (ua.includes('AppleWebKit/5')) {
    return parseOldWebkit(ua);
  } else if (ua.includes('AppleWebKit/')) {
    return parseAppleWebkit(ua);
  } else if (ua.includes('Gecko/20100101')) {
    return parseGeckoModern(ua);
  } else if (ua.includes('Gecko/') || ua.includes('Goanna/')) {
    return parseGeckoGeneric(ua);
  } else {
    return parseGenericMozilla5(ua);
  }
}

function parseMozilla4(ua) {
  if (ua.includes('MSIE')) {
    return parseMsie(ua);
  } else if (ua.includes('compatible')) {
    return parseMozilla4Compatible(ua);
  } else {
    return parseGenericMozilla4(ua);
  }
}

function parseOpera() {
  return { meta: { family: 'Generic Opera' }, regexes: regexes.core.opera };
}

function parseGeneric() {
  return { meta: { family: 'Generic' }, regexes: regexes.core.generic };
}

// Used by parseMozilla5()

function parseTrident() {
  return { meta: { family: 'Generic Trident' }, regexes: regexes.core.trident };
}

function parseMozilla5Compatible(ua) {
  if (ua.includes(' +http') || ua.includes(' http')) {
    return {
      meta: { family: 'Mozilla 5 Compatible URL' },
      regexes: regexes.core.mozilla5_compatible_url,
    };
  }
  return {
    meta: { family: 'Mozilla 5 Compatible' },
    regexes: regexes.core.mozilla5_compatible,
  };
}

function parseMozilla5Url() {
  return {
    meta: { family: 'Mozilla 5 URL' },
    regexes: regexes.core.mozilla5_url,
  };
}

function parseGenericWebkit(ua) {
  if (ua.includes('Chrome/')) {
    if (ua.includes('Version/')) {
      return {
        meta: { family: 'Modern Chrome with Version' },
        regexes: regexes.core.chrome_version,
      };
    }
    if (ua.includes('Electron/')) {
      return {
        meta: { family: 'Modern Chrome with Electron' },
        regexes: regexes.core.chrome_electron,
      };
    }
    return {
      meta: { family: 'Modern Chrome' },
      regexes: regexes.core.chrome,
    };
  }
  return { meta: { family: 'Generic Webkit' }, regexes: regexes.core.webkit };
}

function parseOldWebkit(ua) {
  if (ua.includes('Chrome/')) {
    return {
      meta: { family: 'Old Chrome' },
      regexes: regexes.core.chrome_old,
    };
  }
  return { meta: { family: 'Old Webkit' }, regexes: regexes.core.webkit_old };
}

function parseAppleWebkit(ua) {
  if (ua.includes('Mobile/')) {
    return {
      meta: { family: 'Apple Webkit Mobile' },
      regexes: regexes.core.apple_webkit_mobile,
    };
  }
  return {
    meta: { family: 'Apple Webkit' },
    regexes: regexes.core.apple_webkit,
  };
}

function parseGeckoModern() {
  return { meta: { family: 'Modern Gecko' }, regexes: regexes.core.gecko };
}

function parseGeckoGeneric() {
  return {
    meta: { family: 'Generic Gecko' },
    regexes: regexes.core.gecko_generic,
  };
}

function parseGenericMozilla5() {
  return {
    meta: { family: 'Generic Mozilla 5' },
    regexes: regexes.core.mozilla5,
  };
}

// Used by parseMozilla4()

function parseMsie() {
  return { meta: { family: 'Generic MSIE' }, regexes: regexes.core.msie };
}

function parseGenericMozilla4() {
  return {
    meta: { family: 'Generic Mozilla 4' },
    regexes: regexes.core.mozilla4,
  };
}

function parseMozilla4Compatible() {
  return {
    meta: { family: 'Mozilla 4 Compatible' },
    regexes: regexes.core.mozilla4_compatible,
  };
}

module.exports = { parse };
