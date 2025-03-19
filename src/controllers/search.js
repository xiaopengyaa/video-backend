const KoaRouter = require('koa-router')

const router = new KoaRouter()
const qqApi = require('../services/qq/search')
const { SITE } = require('../utils/constant')

const apiMap = {
  [SITE.qq]: qqApi,
}

router.prefix('/video/api/search')

router.get('/', async (ctx) => {
  const { site = SITE.qq, keyword } = ctx.query
  const data = await apiMap[site].search(keyword)
  ctx.body = data
})

router.get('/recommend', async (ctx) => {
  const { site = SITE.qq, keyword } = ctx.query
  const data = await apiMap[site].getRecommendList(keyword)
  ctx.body = data
})

module.exports = router
