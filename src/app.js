const Koa = require('koa')

const app = new Koa()
const json = require('koa-json')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const { onerror } = require('koa-onerror')
const { debugServer, debugError, debugLog } = require('./utils/debug')
const { responseMiddleware } = require('./middlewares/response')

const PORT = 3111
const search = require('./controllers/search')
const detail = require('./controllers/detail')

// error handler
onerror(app)

// middlewares
app.use(responseMiddleware)
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  })
)
app.use(json())
app.use(
  logger((str) => {
    debugLog(decodeURIComponent(str))
  })
)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  debugLog(`${ctx.method} ${decodeURIComponent(ctx.url)} - ${ms}ms`)
})

// routes
app.use(search.routes(), search.allowedMethods())
app.use(detail.routes(), detail.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  debugError('server error', err, ctx)
})

app.listen(PORT, () => {
  debugServer(`listening on ${PORT}`)
})
