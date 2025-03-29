const axios = require('axios')
const { debugError } = require('../utils/debug')

// 封装api
const api = {
  async get(url, data, config = {}) {
    try {
      const res = await axios.get(url, {
        params: data,
        ...config,
      })
      return new Promise((resolve) => {
        resolve(res.data)
      })
    } catch (err) {
      debugError(err)
      throw new Error(err)
    }
  },
  async post(url, data, config) {
    try {
      const res = await axios.post(url, data, config)
      return new Promise((resolve) => {
        resolve(res.data)
      })
    } catch (err) {
      debugError(err)
      throw new Error(err)
    }
  },
}

module.exports = api
