const debugServer = require('debug')('app:server')
const debugError = require('debug')('app:error')
const debugLog = require('debug')('app:log')

module.exports = {
  debugServer,
  debugError,
  debugLog,
}
