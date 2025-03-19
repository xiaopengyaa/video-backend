// 统一封装响应格式的中间件
async function responseMiddleware(ctx, next) {
  try {
    // 执行后续中间件或路由处理
    await next()

    // 如果没有其他中间件或路由处理修改了响应状态码，则默认为200
    if (!ctx.response.status) {
      ctx.response.status = 200
    }

    // 统一封装响应数据结构
    let data = null
    try {
      data = JSON.parse(ctx.body)
    } catch {
      data = ctx.body
    }
    ctx.body = {
      code: ctx.response.status,
      data,
      message: '请求成功',
    }
  } catch (error) {
    // 处理错误情况
    ctx.response.status = error.status || 500
    ctx.body = {
      code: ctx.response.status,
      data: null,
      message: error.message || '服务器错误啦',
    }
  }
}

module.exports = {
  responseMiddleware,
}
