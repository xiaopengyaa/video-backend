const api = require('../../utils/http')
const { Mf } = require('./md5')

const homeApi = {
  async getDetail(query) {
    const { url } = query
    const siteInfo = await getSiteInfo(url)
    const res = await getData(siteInfo)
    let introduction = {}
    let topList = []
    let videoInfo = {}
    if (res.status_code === 0 && res.data) {
      const data = res.data

      if (data) {
        introduction = getIntro(data.base_data)
        videoInfo = getVideoInfo(data.base_data, siteInfo)
      }
    }
    return {
      introduction,
      topList,
      videoInfo,
    }
  },
  async getPlaylist(query) {
    const { url } = query
    const siteInfo = await getSiteInfo(url)
    const res = await getData(siteInfo)
    const playList = []

    if (res.status_code === 0 && res.data) {
      const data = res.data

      if (data) {
        const tabs = data.template.tabs || []
        const tab = tabs.find((item) => item.tab_id === 'album_tab_1')
        const block = tab?.blocks?.find((item) => item.bk_id === 'selector_bk')
        if (!block) {
          return playList
        }
        const vData = block.data?.data?.find(
          (item) => item.videos?.feature_paged
        )
        if (!vData) {
          return playList
        }
        const videos = getAllVideos(vData.videos)
        videos.forEach((item) => {
          const playItem = getPlayItem(item, vData.entity_id?.toString() || '')
          if (playItem) {
            playList.push(playItem)
          }
        })
      }
    }

    return playList
  },
}

function getPlayItem(item, cid) {
  if (!item.page_url) {
    return
  }

  let mark = null
  let text = item.album_order || item.title

  if (item.content_type === 28) {
    text = item.short_display_name
  }

  if (item.pay_mark > 0) {
    mark = {
      backgroundColor: '#ffdf89',
      fontColor: '#663d00',
      text: 'VIP',
    }
  } else if (item.content_type === 3) {
    mark = {
      backgroundColor: '#ff650f',
      fontColor: '#ffffff',
      text: '预告',
    }
  }

  return {
    vid: item.qipu_id.toString(),
    cid,
    href: item.page_url,
    text: text.toString(),
    mark,
  }
}

async function getData(siteInfo) {
  const url = 'https://mesh.if.iqiyi.com/tvg/v2/lw/base_info'
  const obj = {
    entity_id: siteInfo.vid,
    device_id: '143980fb45f1478bec2f2696fac45401',
    auth_cookie: '',
    user_id: '0',
    vip_type: '-1',
    vip_status: '0',
    conduit_id: '',
    app_version: siteInfo.version,
    ext: '',
    app_mode: 'standard',
    scale: '125',
    timestamp: +new Date(),
    src: 'pca_tvg',
    os: '',
  }
  const o = { secret_key: 'howcuteitis' }
  obj.sign = Mf(obj, o, false, true)
  const res = await api.get(url, obj)
  return res
}

async function getSiteInfo(url) {
  const html = await api.get(
    'https://mesh.if.iqiyi.com/player/lw/lwplay/accelerator.js?apiVer=2',
    null,
    {
      headers: {
        Referer: url,
      },
    }
  )
  const reg = /window\.QiyiPlayerProphetData\s*=\s*(.*?);\s*if/
  const match = reg.exec(html)
  if (match) {
    const data = JSON.parse(match[1])
    return {
      vid: data?.tvid?.toString() || '',
      cid: data?.videoInfo?.albumId?.toString() || '',
      version: data.version,
    }
  }
}

function getIntro(baseData) {
  const kinds =
    baseData?.label
      ?.filter((item) => item.subType === 3)
      .slice(0, 3)
      .map((item) => item.txt) || []
  const splitStr = ' '
  return {
    area: '',
    desc: baseData.desc,
    detailInfo: getDetailInfo(baseData),
    kinds: kinds.join(splitStr),
    title: baseData.title,
    update: baseData?.update_info?.update_notification || '',
    year: baseData.current_video_year || '',
  }
}

function getVideoInfo(item, siteInfo) {
  return {
    vid: siteInfo.vid,
    title: item.current_video_title,
  }
}

function getDetailInfo(item) {
  const arr = []
  if (item.update_info?.update_status) {
    arr.push(item.update_info.update_status)
  }
  if (item.heat) {
    arr.push(`<font color="#FF6022">${item.heat}热度</font>`)
  }

  return arr.join(' · ')
}

function getAllVideos(videos) {
  return Object.values(videos.feature_paged).flat()
}

module.exports = homeApi
