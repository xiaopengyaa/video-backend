const { PARSER_TYPE } = require('../utils/constant')
const { xmjx } = require('./xmjx')
const { qgjx } = require('./qgjx')
const { jyjx } = require('./jyjx')

function getParser(type) {
  if (type === PARSER_TYPE.xmjx) {
    return xmjx.getUrl
  }
  if (type === PARSER_TYPE.qgjx) {
    return qgjx
  }
  if (type === PARSER_TYPE.jyjx) {
    return jyjx
  }
  return xmjx.getUrl
}

module.exports = {
  getParser,
}
