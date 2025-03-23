const KoaRouter = require('koa-router')

const router = new KoaRouter()
const qqApi = require('../services/qq/detail')
const bilibiliApi = require('../services/bilibili/detail')
const qiyiApi = require('../services/qiyi/detail')
const hunantvApi = require('../services/hunantv/detail')
const defaultApi = require('../services/default/detail')
const { SITE } = require('../utils/constant')
const { getParser } = require('../parsers/index')

const apiMap = {
  [SITE.qq]: qqApi,
  [SITE.hunantv]: hunantvApi,
  // [SITE.bilibili]: bilibiliApi,
  // [SITE.qiyi]: qiyiApi,
}

router.prefix('/video/api/detail')

router.get('/getDetail', async (ctx) => {
  const { site } = ctx.query
  const obj = apiMap[site] || defaultApi
  const data = await obj.getDetail(ctx.query)
  ctx.body = data
})

router.post('/getPlaylist', async (ctx) => {
  const { site } = ctx.request.body
  const obj = apiMap[site] || defaultApi
  const data = await obj.getPlaylist(ctx.request.body)
  ctx.body = data
})

router.get('/getVurl', async (ctx) => {
  const { url, type } = ctx.query
  const parser = getParser(type)
  const data = await parser(url)
  ctx.body = data
})

module.exports = router
