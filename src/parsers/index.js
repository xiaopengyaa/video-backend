const { PARSER_TYPE } = require('../utils/constant')
const { xmjx } = require('./xmjx')
const { qgjx } = require('./qgjx')

function getParser(type) {
  if (type === PARSER_TYPE.xmjx) {
    return xmjx.getUrl
  }
  if (type === PARSER_TYPE.qgjx) {
    return qgjx
  }
  return xmjx.getUrl
}

module.exports = {
  getParser,
}
