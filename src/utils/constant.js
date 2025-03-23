// 网站类型
const SITE = {
  qq: 'qq',
  bilibili: 'bilibili',
  qiyi: 'qiyi',
  youku: 'youku',
  migu: 'migu',
  sohu: 'sohu',
  yangshipin: 'yangshipin',
  cntv: 'cntv',
  vip1905: '1905',
  hunantv: 'hunantv',
  letv: 'letv',
  pptv: 'pptv',
  acfun: 'acfun',
}

const SITE_SORT = {
  [SITE.qq]: 1,
  [SITE.bilibili]: 2,
  [SITE.qiyi]: 3,
  [SITE.youku]: 4,
  [SITE.migu]: 5,
  [SITE.sohu]: 6,
  [SITE.vip1905]: 7,
  [SITE.hunantv]: 8,
  [SITE.letv]: 9,
  [SITE.acfun]: 10,
  [SITE.pptv]: 11,
  [SITE.cntv]: 12,
  [SITE.yangshipin]: 13,
  default: 99,
}

// 视频类型
const TYPE = {
  MOVIE: 1,
  TV: 2,
  CARTOON: 3,
  SPORT: 4,
  ENT: 5,
  GAME: 6,
  RECORD: 9,
  VARIETY: 10,
  WORLD_CUP: 21,
  MUSIC: 22,
  NEWS: 23,
  FINANCE: 24,
  FASHION: 25,
  TRAVEL: 26,
  EDUCATION: 27,
  TECH: 28,
  CAR: 29,
  ESTATE: 30,
  LIFE: 31,
  MICROTEACHING: 37,
  AD: 40,
  SELFIE: 41,
  FUNNY: 43,
  CONF_AND_BUD: 45,
  MICROMOVIE: 46,
  COOPERATION: 50,
  CULTURE: 51,
  YOUTH: 52,
  MOTHER_AND_BABY: 60,
  ORIGINAL: 103,
  SHOOTER: 105,
  CHILDREN: 106,
}

const PARSER_TYPE = {
  qgjx: 'qgjx',
  xmjx: 'xmjx',
}

module.exports = {
  SITE,
  SITE_SORT,
  TYPE,
  PARSER_TYPE,
}
