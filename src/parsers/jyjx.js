const CryptoJS = require('crypto-js')
const qs = require('qs')
const cheerio = require('cheerio')
const api = require('../utils/http')
const { debugLog } = require('../utils/debug')
const { retry } = require('../utils/common')
let KEYS = []

async function jyjx(url) {
  const pageMsg = 'jy接口parse'
  const options = { retryTitle: pageMsg }
  let src = ''
  try {
    src = await retry(async () => {
      const d = await getEncryptData(url)
      return getUrl(d)
    }, options)
  } catch (e) {
    src = ''
  }

  return src
}

function getUrl($d) {
  let $k = CryptoJS.MD5('llqplayerparsedata').toString()
  let r = JSON.parse(decrypt($d, funcS($k), funcSS($k)))

  if (r['code'] == 200) {
    let $p = r['vkey']
    if (!RegExp(/http/)['test']($p)) {
      let u = funcDC(funcH(funcB(KEYS[2]), $p), 2)
      if (u) {
        // 代理一下接口，不然请求不到
        u = '/video/api/proxy/jyjx/' + u
        return u
      }
    }
  }

  return ''
}

async function getEncryptData(url) {
  const link = await getLink(url)
  const media = await getMedia(link)
  KEYS = await getKeys(media)
  const d = decrypt(funcB(KEYS[1]), '3b5ae5f5aa0a9cbc', 'e60dd2809c18ebde')
  const llq = funcDC(d, 1)
  const req = {
    requestId: Math.random(),
    timestamp: Date['parse'](new Date()),
  }
  req.signature = CryptoJS.MD5(reverse(strings(req, 1)))['toString']()
  req.llq = llq
  const apiUrl = 'https://media.staticfile.link/api.php'
  debugLog(`jy接口获取api: ${apiUrl}`)
  const res = await api.post(apiUrl, qs.stringify(req), {
    headers: {
      Amethod: getAmethod('parse'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  return res
}

async function getKeys(url) {
  debugLog(`jy接口获取key: ${url}`)
  const html = await api.get(url)
  const reg = /const\s+KEYS\s*=\s*\[\s*(.*),\s*\]\s*;/
  const match = reg.exec(html.replace(/[\n\r]/g, ''))
  if (match) {
    const keys = match[1].replace(/['\s]/g, '').split(',')
    return keys || []
  } else {
    throw new Error(`${url}: 获取key失败`)
  }
}

async function getLink(url) {
  const site = 'https://jx.playerjy.com'
  debugLog(`jy接口获取link: ${site}`)
  const html = await api.get(site, { url })
  const $ = cheerio.load(html)
  const iframeSrc = $('#myiframe').attr('src')
  if (iframeSrc) {
    return iframeSrc
  } else {
    throw new Error(`${site}: iframe的src为空`)
  }
}

async function getMedia(url) {
  debugLog(`jy接口获取media: ${url}`)
  const html = await api.get(url)
  const $ = cheerio.load(html)
  const iframeSrc = $('#myiframe').attr('src')
  if (iframeSrc) {
    return iframeSrc
  } else {
    throw new Error(`${url}: iframe的src为空`)
  }
}

function getAmethod(str) {
  const reg = /%([0-9A-F]{2})/g
  const c = encodeURIComponent(str)['replace'](reg, (a, b) => {
    return String['fromCharCode'](('0x', b))
  })
  return btoa(c)
}

function reverse(str) {
  return str.split('').reverse().join('')
}

function funcB(str) {
  const s1 = str.slice(-8)
  const s2 = str.slice(0, -8)
  return s1.concat(s2)
}

function funcDC(s, c) {
  let k = ''
  let n = 0
  s = funcR(s)['split']('')
  while (n < s['length']) {
    k += String['fromCodePoint'](s[n]['charCodeAt']() + parseInt(c))
    n++
  }
  return atob(k)
}

function funcH($d, $p) {
  let _0x520a24 = 1
  let _0x229952 = CryptoJS.MD5('llq1.2.5playerskey').toString()
  let $k = CryptoJS.MD5('vllq1.2.5player3').toString()
  let _0x274a0d = decrypt($d, funcS($k), funcSS($k))
  $k = _0x229952
  $d = funcDC(_0x274a0d, '1')
  _0x229952 = JSON.parse(decrypt($d, funcS($k), funcSS($k)))['url']
  $k = funcA(_0x229952)
  $d = _0x520a24 ? $p : funcDC($p, '1')
  return JSON.parse(decrypt($d, funcS($k), funcSS($k)))['url']
}

function funcA(str) {
  let a = str.slice(24, 28)
  let b = str.slice(12, 24)
  let c = str.slice(28, 32)
  let d = str.slice(0, 12)
  return a.concat(b, c, d)
}

function funcS(str) {
  let a = str.slice(0, 4)
  let b = str.slice(20, 32)
  return a.concat(b)
}

function funcSS(str) {
  let a = str.slice(16, 20)
  let b = str.slice(4, 16)
  return a.concat(b)
}

function funcR(str) {
  return str['split']('').reverse().join('')
}

function strings(obj, k = 0) {
  const keys = [
    '8u2sfQ9Ng8',
    'Zm5D0v0Y8a',
    'EMAR9wkGCt',
    'T2BGLJ4OIV',
    'iEtD4PnW1S',
    'VrGRPA7Dpl',
    'FqBG8QynCh',
  ]
  const d = new Date()['getDay']() + 1
  const a = qs.stringify(obj)
  return a.concat(k ? keys[d >= 7 ? 0 : d] : '')
}

function decrypt(d, s1, s2) {
  if (!d || !s1 || !s2) {
    return ''
  }

  return CryptoJS.AES.decrypt(d, CryptoJS.enc.Utf8.parse(s1), {
    iv: CryptoJS.enc.Utf8.parse(s2),
    padding: CryptoJS.pad.Pkcs7,
  })['toString'](CryptoJS.enc.Utf8)
}

module.exports = { jyjx }
