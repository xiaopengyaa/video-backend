const rr = {
  rotl: function (t, e) {
    return (t << e) | (t >>> (32 - e))
  },
  rotr: function (t, e) {
    return (t << (32 - e)) | (t >>> e)
  },
  endian: function (t) {
    if (t.constructor == Number)
      return (16711935 & rr.rotl(t, 8)) | (4278255360 & rr.rotl(t, 24))
    for (var e = 0; e < t.length; e++) t[e] = rr.endian(t[e])
    return t
  },
  randomBytes: function (t) {
    for (var e = []; t > 0; t--) e.push(Math.floor(256 * Math.random()))
    return e
  },
  bytesToWords: function (t) {
    for (var e = [], r = 0, n = 0; r < t.length; r++, n += 8)
      e[n >>> 5] |= t[r] << (24 - (n % 32))
    return e
  },
  wordsToBytes: function (t) {
    for (var e = [], r = 0; r < 32 * t.length; r += 8)
      e.push((t[r >>> 5] >>> (24 - (r % 32))) & 255)
    return e
  },
  bytesToHex: function (t) {
    for (var e = [], r = 0; r < t.length; r++)
      e.push((t[r] >>> 4).toString(16)), e.push((15 & t[r]).toString(16))
    return e.join('')
  },
  hexToBytes: function (t) {
    for (var e = [], r = 0; r < t.length; r += 2)
      e.push(parseInt(t.substr(r, 2), 16))
    return e
  },
  bytesToBase64: function (t) {
    for (var r = [], n = 0; n < t.length; n += 3)
      for (var i = (t[n] << 16) | (t[n + 1] << 8) | t[n + 2], o = 0; o < 4; o++)
        8 * n + 6 * o <= 8 * t.length
          ? r.push(e.charAt((i >>> (6 * (3 - o))) & 63))
          : r.push('=')
    return r.join('')
  },
  base64ToBytes: function (t) {
    t = t.replace(/[^A-Z0-9+\/]/gi, '')
    for (var r = [], n = 0, i = 0; n < t.length; i = ++n % 4)
      0 != i &&
        r.push(
          ((e.indexOf(t.charAt(n - 1)) & (Math.pow(2, -2 * i + 8) - 1)) <<
            (2 * i)) |
            (e.indexOf(t.charAt(n)) >>> (6 - 2 * i))
        )
    return r
  },
}

const ss = {
  utf8: {
    stringToBytes: function (t) {
      return ss.bin.stringToBytes(unescape(encodeURIComponent(t)))
    },
    bytesToString: function (t) {
      return decodeURIComponent(escape(e.bin.bytesToString(t)))
    },
  },
  bin: {
    stringToBytes: function (t) {
      for (var e = [], r = 0; r < t.length; r++) e.push(255 & t.charCodeAt(r))
      return e
    },
    bytesToString: function (t) {
      for (var e = [], r = 0; r < t.length; r++)
        e.push(String.fromCharCode(t[r]))
      return e.join('')
    },
  },
}

function i(t) {
  return (
    null != t &&
    (e(t) ||
      (function (t) {
        return (
          'function' === typeof t.readFloatLE &&
          'function' === typeof t.slice &&
          e(t.slice(0, 0))
        )
      })(t) ||
      !!t._isBuffer)
  )
}

function a(t, r) {
  var n = ss.utf8
  var o = ss.bin
  var e = rr
  t.constructor == String
    ? (t =
        r && 'binary' === r.encoding ? o.stringToBytes(t) : n.stringToBytes(t))
    : i(t)
    ? (t = Array.prototype.slice.call(t, 0))
    : Array.isArray(t) || t.constructor === Uint8Array || (t = t.toString())
  for (
    var s = e.bytesToWords(t),
      l = 8 * t.length,
      u = 1732584193,
      c = -271733879,
      h = -1732584194,
      p = 271733878,
      f = 0;
    f < s.length;
    f++
  )
    s[f] =
      (16711935 & ((s[f] << 8) | (s[f] >>> 24))) |
      (4278255360 & ((s[f] << 24) | (s[f] >>> 8)))
  ;(s[l >>> 5] |= 128 << l % 32), (s[14 + (((l + 64) >>> 9) << 4)] = l)
  var d = a._ff,
    g = a._gg,
    x = a._hh,
    m = a._ii
  for (f = 0; f < s.length; f += 16) {
    var v = u,
      y = c,
      b = h,
      _ = p
    ;(u = d(u, c, h, p, s[f + 0], 7, -680876936)),
      (p = d(p, u, c, h, s[f + 1], 12, -389564586)),
      (h = d(h, p, u, c, s[f + 2], 17, 606105819)),
      (c = d(c, h, p, u, s[f + 3], 22, -1044525330)),
      (u = d(u, c, h, p, s[f + 4], 7, -176418897)),
      (p = d(p, u, c, h, s[f + 5], 12, 1200080426)),
      (h = d(h, p, u, c, s[f + 6], 17, -1473231341)),
      (c = d(c, h, p, u, s[f + 7], 22, -45705983)),
      (u = d(u, c, h, p, s[f + 8], 7, 1770035416)),
      (p = d(p, u, c, h, s[f + 9], 12, -1958414417)),
      (h = d(h, p, u, c, s[f + 10], 17, -42063)),
      (c = d(c, h, p, u, s[f + 11], 22, -1990404162)),
      (u = d(u, c, h, p, s[f + 12], 7, 1804603682)),
      (p = d(p, u, c, h, s[f + 13], 12, -40341101)),
      (h = d(h, p, u, c, s[f + 14], 17, -1502002290)),
      (u = g(
        u,
        (c = d(c, h, p, u, s[f + 15], 22, 1236535329)),
        h,
        p,
        s[f + 1],
        5,
        -165796510
      )),
      (p = g(p, u, c, h, s[f + 6], 9, -1069501632)),
      (h = g(h, p, u, c, s[f + 11], 14, 643717713)),
      (c = g(c, h, p, u, s[f + 0], 20, -373897302)),
      (u = g(u, c, h, p, s[f + 5], 5, -701558691)),
      (p = g(p, u, c, h, s[f + 10], 9, 38016083)),
      (h = g(h, p, u, c, s[f + 15], 14, -660478335)),
      (c = g(c, h, p, u, s[f + 4], 20, -405537848)),
      (u = g(u, c, h, p, s[f + 9], 5, 568446438)),
      (p = g(p, u, c, h, s[f + 14], 9, -1019803690)),
      (h = g(h, p, u, c, s[f + 3], 14, -187363961)),
      (c = g(c, h, p, u, s[f + 8], 20, 1163531501)),
      (u = g(u, c, h, p, s[f + 13], 5, -1444681467)),
      (p = g(p, u, c, h, s[f + 2], 9, -51403784)),
      (h = g(h, p, u, c, s[f + 7], 14, 1735328473)),
      (u = x(
        u,
        (c = g(c, h, p, u, s[f + 12], 20, -1926607734)),
        h,
        p,
        s[f + 5],
        4,
        -378558
      )),
      (p = x(p, u, c, h, s[f + 8], 11, -2022574463)),
      (h = x(h, p, u, c, s[f + 11], 16, 1839030562)),
      (c = x(c, h, p, u, s[f + 14], 23, -35309556)),
      (u = x(u, c, h, p, s[f + 1], 4, -1530992060)),
      (p = x(p, u, c, h, s[f + 4], 11, 1272893353)),
      (h = x(h, p, u, c, s[f + 7], 16, -155497632)),
      (c = x(c, h, p, u, s[f + 10], 23, -1094730640)),
      (u = x(u, c, h, p, s[f + 13], 4, 681279174)),
      (p = x(p, u, c, h, s[f + 0], 11, -358537222)),
      (h = x(h, p, u, c, s[f + 3], 16, -722521979)),
      (c = x(c, h, p, u, s[f + 6], 23, 76029189)),
      (u = x(u, c, h, p, s[f + 9], 4, -640364487)),
      (p = x(p, u, c, h, s[f + 12], 11, -421815835)),
      (h = x(h, p, u, c, s[f + 15], 16, 530742520)),
      (u = m(
        u,
        (c = x(c, h, p, u, s[f + 2], 23, -995338651)),
        h,
        p,
        s[f + 0],
        6,
        -198630844
      )),
      (p = m(p, u, c, h, s[f + 7], 10, 1126891415)),
      (h = m(h, p, u, c, s[f + 14], 15, -1416354905)),
      (c = m(c, h, p, u, s[f + 5], 21, -57434055)),
      (u = m(u, c, h, p, s[f + 12], 6, 1700485571)),
      (p = m(p, u, c, h, s[f + 3], 10, -1894986606)),
      (h = m(h, p, u, c, s[f + 10], 15, -1051523)),
      (c = m(c, h, p, u, s[f + 1], 21, -2054922799)),
      (u = m(u, c, h, p, s[f + 8], 6, 1873313359)),
      (p = m(p, u, c, h, s[f + 15], 10, -30611744)),
      (h = m(h, p, u, c, s[f + 6], 15, -1560198380)),
      (c = m(c, h, p, u, s[f + 13], 21, 1309151649)),
      (u = m(u, c, h, p, s[f + 4], 6, -145523070)),
      (p = m(p, u, c, h, s[f + 11], 10, -1120210379)),
      (h = m(h, p, u, c, s[f + 2], 15, 718787259)),
      (c = m(c, h, p, u, s[f + 9], 21, -343485551)),
      (u = (u + v) >>> 0),
      (c = (c + y) >>> 0),
      (h = (h + b) >>> 0),
      (p = (p + _) >>> 0)
  }
  return e.endian([u, c, h, p])
}
a._ff = function (t, e, r, n, i, o, a) {
  var s = t + ((e & r) | (~e & n)) + (i >>> 0) + a
  return ((s << o) | (s >>> (32 - o))) + e
}

a._gg = function (t, e, r, n, i, o, a) {
  var s = t + ((e & n) | (r & ~n)) + (i >>> 0) + a
  return ((s << o) | (s >>> (32 - o))) + e
}

a._hh = function (t, e, r, n, i, o, a) {
  var s = t + (e ^ r ^ n) + (i >>> 0) + a
  return ((s << o) | (s >>> (32 - o))) + e
}

a._ii = function (t, e, r, n, i, o, a) {
  var s = t + (r ^ (e | ~n)) + (i >>> 0) + a
  return ((s << o) | (s >>> (32 - o))) + e
}

a._blocksize = 16
a._digestsize = 16

function Mf(e, t, i, o) {
  const n = ((e, t, i) => {
    const o = Object.keys(e)
    o.sort()
    let n = ''
    for (let l = 0; l < o.length; l++) {
      const t = o[l]
      n += (l > 0 ? '&' : '') + t + '=' + (i ? e[t] : encodeURIComponent(e[t]))
    }
    if (t)
      if ('string' === typeof t) n += t
      else {
        n += '&'
        for (const e of Object.keys(t)) n += `${e}=${t[e]}`
      }
    return n
  })(e, t, o)
  return i ? U(n).toLowerCase() : U(n).toUpperCase()
}

function U(t, r) {
  if (void 0 === t || null === t) throw new Error('Illegal argument ' + t)
  var n = rr.wordsToBytes(a(t, r))
  return r && r.asBytes
    ? n
    : r && r.asString
    ? ss.bin.bytesToString(n)
    : rr.bytesToHex(n)
}

module.exports = { Mf }
