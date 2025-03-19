const { getResult, getSiteByUrl, processUrl } = require('../../utils/common')
const api = require('../../utils/http')
const { COOKIE, REFERER } = require('./constant')
const { generateUuid } = require('../../utils/searchUtil')
const { debugError } = require('../../utils/debug')

const homeApi = {
  // 搜索
  async search(keyword, cid) {
    const params = {
      version: '24072901',
      clientType: 1,
      filterValue: '',
      retry: 0,
      query: keyword,
      pagenum: 0,
      pagesize: 30,
      queryFrom: 0,
      searchDatakey: '',
      transInfo: '',
      isneedQc: true,
      preQid: '',
      adClientInfo: '',
      extraInfo: { isNewMarkLabel: '1', multi_terminal_pc: '1' },
      uuid: generateUuid(),
    }
    const url = `https://pbaccess.video.qq.com/trpc.videosearch.mobile_search.MultiTerminalSearch/MbSearch?vplatform=2`
    const res = await api.post(url, params, {
      headers: {
        cookie: COOKIE,
        origin: REFERER,
        referer: REFERER,
        'content-type': 'application/json',
        'trpc-trans-info': '{"trpc-env":""}',
      },
    })

    let list = []

    if (res.ret === 0) {
      list = getSearchList(res.data)
    }

    if (!list.length) {
      console.log(`搜索结果【${keyword}】为空`)
    }

    return {
      list,
      relateList: [],
    }
  },
  async getRecommendList(keyword) {
    const url = `https://nodeyun.video.qq.com/x/api/smartbox`
    const now = +new Date()
    const callback = `jQuery19105739095169365356_${now}`
    const html = await api.get(
      url,
      {
        query: keyword,
        callback,
        _: now,
      },
      {
        headers: {
          cookie: COOKIE,
          referer: REFERER,
        },
      }
    )
    const reg = new RegExp(`${callback}\\((.*)\\)`)
    const match = html.match(reg)
    let list = []
    if (match) {
      const res = JSON.parse(match[1])
      if (res.ret === 0 && res.data?.smartboxItemList) {
        list = res.data.smartboxItemList.map((item) => {
          return {
            title: item.basicDoc.title.replace(/em/g, 'strong'),
            imgUrl: item.videoInfo.imgUrl,
            videoType: item.videoInfo.videoType,
            typeName: item.videoInfo.typeName,
          }
        })
      }
    }
    return list
  },
}

function getSearchList(data) {
  const list = []
  const itemList = data.normalList.itemList
  const areaBoxList = data.areaBoxList.map((item) => {
    return item.itemList.filter(
      (cItem) => cItem?.videoInfo?.episodeSites?.length
    )
  })
  const allList = itemList.concat(areaBoxList.flat())

  if (allList && allList.length > 0) {
    allList.forEach((item) => {
      if (item.videoInfo) {
        const videoInfo = item.videoInfo
        const cid = item?.doc?.id || ''
        const episodeSites = videoInfo.episodeSites?.filter(
          (site) => site?.episodeInfoList?.length
        )
        const playSites = videoInfo.playSites
        let allSites = []
        let isPlaySite = false
        if (episodeSites && episodeSites.length > 0) {
          allSites = episodeSites
        } else if (playSites && playSites.length > 0) {
          allSites = playSites
          isPlaySite = true
        }
        if (allSites && allSites.length > 0) {
          const episodeSite = allSites[0]
          const imgTag = videoInfo.imgTag
          let mark = null
          let imageInfo = ''
          try {
            if (imgTag) {
              const obj = JSON.parse(imgTag)
              imageInfo = obj.tag_4.text
              mark = obj.tag_2
            }
          } catch (e) {
            debugError('序列化失败:', e)
          }
          const item = {
            site: episodeSite.enName,
            cid,
            image: videoInfo.imgUrl,
            imageInfo,
            mark,
            title: videoInfo.title,
            href: '',
            sub: [videoInfo.typeName, videoInfo.area],
            desc: videoInfo.descrip,
            playlist: [],
            btnlist: [],
          }
          if (
            episodeSite.episodeInfoList &&
            episodeSite.episodeInfoList.length > 0
          ) {
            episodeSite.episodeInfoList.forEach((cItem) => {
              const urlObj = processUrl(cItem.url)
              let mark = null
              try {
                if (cItem.markLabel) {
                  const obj = JSON.parse(cItem.markLabel)
                  mark = obj.tag_2
                }
              } catch (e) {
                console.log(e)
              }
              const playItem = {
                cid: urlObj.cid,
                vid: urlObj.vid,
                href: urlObj.href,
                text: cItem.title,
                mark,
              }
              if (episodeSite.uiType === 3 || isPlaySite) {
                item.btnlist.push(playItem)
              } else {
                item.playlist.push(playItem)
              }
            })
          }
          list.push(item)
        }
      }
    })
  }

  return list
}

module.exports = homeApi
