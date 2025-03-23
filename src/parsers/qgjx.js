const cheerio = require('cheerio')
const api = require('../utils/http')
const SITE = 'https://jx.nnxv.cn/'

async function qgjx(url) {
  const html = await api.get(
    `${SITE}tv.php`,
    { url },
    {
      headers: {
        Referer: SITE,
      },
    }
  )
  const $ = cheerio.load(html)
  const src = $('#myiframe').attr('src')
  const vurl = await getVurl(SITE + src)
  return vurl
}

async function getVurl(url) {
  const html = await api.get(url, null, {
    headers: {
      Referer: SITE,
    },
  })
  const reg = /var\s+videoUrl\s*=\s*'(.*)';/
  const match = reg.exec(html)
  if (match) {
    return decode(match[1])
  }
  return ''
}

function decode(_0x7246d6) {
  var _0x7246d6 = getHex(_0x7246d6),
    _0x30a5b8 = getDec(_0x7246d6['hex']),
    _0x7246d6 = delStr(_0x7246d6['str'], _0x30a5b8['pre']),
    _0x7246d6 = delStr(_0x7246d6, getPos(_0x7246d6, _0x30a5b8['tail']))
  return decodeURIComponent(escape(atob(_0x7246d6)))
}

function getHex(_0x419367) {
  return {
    str: _0x419367['substring'](5),
    hex: _0x419367['substring'](0, 5)['split']('')['reverse']()['join'](''),
  }
}

function getDec(_0x1a624d) {
  return {
    pre: (_0x1a624d = parseInt(_0x1a624d, 16)['toString']())
      ['substring'](0, 3)
      ['split'](''),
    tail: _0x1a624d['substring'](3)['split'](''),
  }
}

function getPos(_0x376e16, _0x5d6e20) {
  return [
    uZaoY(IxwEZ(_0x376e16['length'], _0x5d6e20[0]), _0x5d6e20[1]),
    _0x5d6e20[1],
  ]
}

function uZaoY(_0x1cebe8, _0x338cd4) {
  return _0x1cebe8 - _0x338cd4
}

function IxwEZ(_0x217a6a, _0x27ee09) {
  return _0x217a6a - _0x27ee09
}

function delStr(_0x50bc55, _0xc0e9d8) {
  var _0x345202 = _0x50bc55['substring'](0, _0xc0e9d8[0]),
    _0x10c5e2 = _0x50bc55['substr'](_0xc0e9d8[0], _0xc0e9d8[1])
  return eZsSp(
    _0x345202,
    _0x50bc55['substring'](_0xc0e9d8[0])['replace'](_0x10c5e2, '')
  )
}

function eZsSp(_0xdf6c26, _0x4487e1) {
  return _0xdf6c26 + _0x4487e1
}

function atob(str) {
  return Buffer.from(str, 'base64').toString('utf-8')
}

module.exports = { qgjx }
