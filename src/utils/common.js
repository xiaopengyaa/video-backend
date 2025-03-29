const { SITE } = require('./constant')
const { debugLog, debugError } = require('./debug')

module.exports = {
  addChineseUnit,
  getSiteByUrl(url) {
    let site = SITE.qq
    Object.values(SITE).forEach((value) => {
      if (url.includes(value)) {
        site = value
      }
    })
    return site
  },
  getImageUrl(url) {
    if (url) {
      return url.replace(/^(http)s*(:\/\/)/, 'https://images.weserv.nl/?url=')
    }
    return url
  },
  dedupe(array) {
    return Array.from(new Set(array))
  },
  restoreHtmlText(str) {
    return str.replace(/<span\sclass="main">(.*?)<\/span>/g, '$1')
  },
  processUrl(url) {
    const reg = /cover\/(.*)\.html/
    const match = reg.exec(url)
    let href = url
    let cid = ''
    let vid = ''
    if (url.includes('search_redirect.html')) {
      const params = href.split('?')[1]
      const searchParams = new URLSearchParams(`?${params}`)
      href = searchParams.get('url') || ''
      cid = searchParams.get('cid') || ''
      vid = getDefaultVid(href)
    } else if (match) {
      const arr = match[1].split('/')
      cid = arr[0]
      vid = arr[1] || ''
    }
    return {
      href,
      cid,
      vid,
    }
  },
  getDefaultVid,
  retry,
}

/**
 * 为数字加上单位：万或亿
 * @param {number} number 输入数字.
 * @param {number} decimalDigit 小数点后最多位数，默认为2
 * @return {string} 加上单位后的数字
 */
function addChineseUnit(number, decimalDigit) {
  decimalDigit = decimalDigit == null ? 2 : decimalDigit
  const integer = Math.floor(number)
  const digit = getDigit(integer)
  // ['个', '十', '百', '千', '万', '十万', '百万', '千万'];
  const unit = []
  if (digit > 3) {
    const multiple = Math.floor(digit / 8)
    if (multiple >= 1) {
      const tmp = Math.round(integer / 10 ** (8 * multiple))
      unit.push(addWan(tmp, number, 8 * multiple, decimalDigit))
      for (let i = 0; i < multiple; i++) {
        unit.push('亿')
      }
      return unit.join('')
    } else {
      return addWan(integer, number, 0, decimalDigit)
    }
  } else {
    return number
  }
}

function addWan(integer, number, mutiple, decimalDigit) {
  const digit = getDigit(integer)
  if (digit > 3) {
    let remainder = digit % 8
    if (remainder >= 5) {
      // ‘十万’、‘百万’、‘千万’显示为‘万’
      remainder = 4
    }
    return `${
      Math.round(number / 10 ** (remainder + mutiple - decimalDigit)) /
      10 ** decimalDigit
    }万`
  } else {
    return (
      Math.round(number / 10 ** (mutiple - decimalDigit)) / 10 ** decimalDigit
    )
  }
}

function getDigit(integer) {
  let digit = -1
  while (integer >= 1) {
    digit++
    integer = integer / 10
  }
  return digit
}

function getDefaultVid(url) {
  let vid = ''
  if (!url) {
    return vid
  }
  const vidReg = [
    {
      site: SITE.youku,
      reg: /youku.com\/v_show\/id_(.*?)\.html/,
    },
    {
      site: SITE.migu,
      reg: /miguvideo\.com.*detail\.html.*cid=(.*?)(&.*|$)/,
    },
    {
      site: SITE.sohu,
      reg: /tv\.sohu\.com\/v\/(.*)\.html/,
    },
    {
      site: SITE.yangshipin,
      reg: /yangshipin\.cn\/video.*vid=(.*?)(&.*|$)/,
    },
    {
      site: SITE.cntv,
      reg: /cctv\.com.*VIDE(.*)\.shtml/,
    },
    {
      site: SITE.vip1905,
      reg: /vip\.1905\.com\/play\/(.*)\.shtml/,
    },
    {
      site: SITE.hunantv,
      reg: /mgtv\.com.*\/(.*?)\.html/,
    },
    {
      site: SITE.letv,
      reg: /le\.com\/ptv\/vplay\/(.*)\.html/,
    },
    {
      site: SITE.pptv,
      reg: /pptv\.com\/page\/(.*)\.html/,
    },
    {
      site: SITE.acfun,
      reg: /acfun\.cn.*\/(.*)/,
    },
    {
      site: SITE.qiyi,
      reg: /iqiyi\.com\/(.*)\.html/,
    },
  ]
  vidReg.forEach((item) => {
    const match = item.reg.exec(url)
    if (match) {
      vid = match[1]
    }
  })
  return vid
}

function retry(fn, { maxRetries = 3, retryTitle = '接口' }) {
  return new Promise((resolve, reject) => {
    let attempts = 0

    function execute() {
      fn()
        .then(resolve)
        .catch((err) => {
          debugError(`${retryTitle}错误`, err)
          attempts++
          if (attempts <= maxRetries) {
            debugLog(`${retryTitle}第${attempts}次重试...`)
            execute()
          } else {
            reject(err)
          }
        })
    }

    execute()
  })
}
