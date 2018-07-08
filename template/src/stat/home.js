import { send, flush } from 'util/utils'

// tab 埋点 pi 映射
const tabPIMap = {
  '0': 'H_TAB_1', // 推荐
  '1': 'H_TAB_2', // 孕产
  '2': 'H_TAB_3', // 育儿
  '3': 'H_TAB_4', // 亲子
  '4': 'H_TAB_5', // 种草
  '5': 'H_TAB_6', // 美食
  '6': 'H_TAB_7', // 时尚
  '7': 'H_TAB_8', // 生活
  '8': 'H_TAB_9'  // 瘦身
}

// 首页 Tab 曝光
function tabExposure (tabId) {
  send({
    pi: tabPIMap[tabId],
    an: '1'
  })
}

// 卡片分享点击
function cardShareBtnClick (id, ii) {
  send({
    an: '2',
    ii,
    be: `bsjx_content_id=${id}`
  })
}

// 生成分享卡片点击, 分享给好友点击
function shareCardBtnClick (id, ii) {
  send({
    an: '2',
    ii,
    be: `bsjx_content_id=${id}`
  })
}

// 首页卡片曝光
function cardExposure (id, index) {
  send({
    an: '1',
    ii: '01',
    be: `bsjx_content_id=${id}`,
    po: `${index}`
  })
}

// 首页卡片点击
function cardClick (id, index) {
  send({
    an: '2',
    ii: '01',
    be: `bsjx_content_id=${id}`,
    po: `${index}`
  })
}

export default {
  tabExposure,
  cardShareBtnClick,
  shareCardBtnClick,
  cardExposure,
  cardClick
}
