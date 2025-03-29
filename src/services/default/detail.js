const { restoreHtmlText } = require('../../utils/common')
const qqApi = require('../qq/search')

const homeApi = {
  async getDetail(query) {
    const { queryTxt, cid, url } = query
    const res = await qqApi.search(queryTxt, cid)
    let introduction = {}
    let topList = []
    let videoInfo = {}
    if (res.code === 0) {
      const data = res.result
      const item = data.list?.[0]

      topList = data.relateList

      if (item) {
        introduction = await getIntro(item)
        videoInfo = getVideoInfo(item, url)
      }
    }
    return {
      introduction,
      topList,
      videoInfo,
    }
  },
  async getPlaylist(query) {
    const { queryTxt, cid } = query
    const res = await qqApi.search(queryTxt, cid)
    let playList = []
    if (res.code === 0 && res.result.list?.[0]) {
      const item = res.result.list?.[0]
      playList = item.playlist
    }
    return playList
  },
}

async function getIntro(item) {
  return {
    area: '',
    desc: item.desc,
    detailInfo: item.sub.join(' · '),
    kinds: '',
    title: restoreHtmlText(item.title),
    update: '',
    year: '',
  }
}

function getVideoInfo(item, url) {
  const videoInfo = {
    vid: '',
    title: restoreHtmlText(item.title),
  }
  const playItem = item.playlist.find((data) => {
    return data.href === url
  })

  if (playItem) {
    videoInfo.vid = playItem.vid
  }

  return videoInfo
}

module.exports = homeApi
