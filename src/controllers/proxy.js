const KoaRouter = require('koa-router')
const axios = require('axios')
const router = new KoaRouter()

router.prefix('/video/api/proxy')

router.get('/jyjx/play', async (ctx) => {
  const url = 'https://media.staticfile.link/play'
  const res = await axios.get(url, {
    params: ctx.query,
  })

  // 透传响应头
  // Object.entries(res.headers).forEach(([key, value]) => {
  //   ctx.set(key, value)
  // })
  ctx.set('Content-Type', 'application/octet-stream')
  ctx.set('NO-PARSE', '1')
  // ctx.status = res.status
  ctx.body = res.data
})

module.exports = router
