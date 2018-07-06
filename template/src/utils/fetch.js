/**
 * @fileoverview 基于 wx.request 和 Promise 进行 fetch 工具封装
 * @author jialong | jialong@babytree-inc.com
 * @version 2.0 | 2018-05-30
*/

import wepy from 'wepy'
const systemInfo = wepy.getSystemInfoSync()
const { platform, windowWidth, windowHeight } = systemInfo || {}
const token = wepy.getStorageSync('token') || ''
const OUTTIME = 10000
const commonHeader = {
  clientInfo: JSON.stringify({
    clientAppVersion: '1.9.8',    // 客户端版本 （独立版）
    clientYunyuVersion: '',       // 客户端版本 （孕育版）
    clientSystem: platform,       // 客户端系统类型(如IOS、安卓)
    clientVersion: '',            // 客户端系统版本(如9.0、10.0)
    deviceCode: '',               // 客户端标志
    latitude: '',                 // 经度
    longitude: '',                // 维度
    traderName: '',               // 手机型号(如iPhone 6s、iPhone7)
    partner: 'babytree',          // 渠道标志
    nettype: 'unknown',           // 网络类型标志(如WIFI、2G、3G、4G)
    clientip: '',                 // 客户端IP
    screenwidth: windowWidth,     // 设备分辨率宽度
    screenheight: windowHeight    // 设备分辨率高度
  }),
  platform: '1',
  birthday: '',                                   // 宝宝生日
  timestamp: Date.parse(new Date()),              // 时间戳(1970年以来的秒数)
  signature: '350F163035D51E8D400114BE70EDFBFA',  // 签名
  protocol: 'https',                              // 本次请求的用户协议类型
  token                                           // 用户token
}

/**
 * fetch 方法
 * @param url {String}  请求路径
 * @param data {Object}  请求要携带的数据
 * @param options {Object}  请求额外的配置信息
 * @return Promise
*/
function fetch(url, data = {}, options = {}) {
  const { header, ...restOpts } = options
  let params = {
    url,
    data,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      ...commonHeader,
      ...header
    },
    ...restOpts
  }
  let promiseRes = new Promise((resolve, reject) => {
    let timer = setTimeout(() => {
      requestTask.abort()
      reject({ msg: '请求超时，请稍后重试' })
    }, OUTTIME)
    let requestTask = wx.request({
      success(res) {
        const { statusCode } = res
        if (statusCode !== 200) {
          reject({ msg: '网络请求错误，请稍后重试' })
        }
        resolve(res)
      },
      fail(error) {
        const { msg = '网络请求错误，请稍后重试' } = error
        wepy.showToast({
          title: msg,
          icon: 'none',
          duration: 2000
        })
        reject({ msg: '网络请求错误，请稍后重试' })
      },
      complete() {
        clearTimeout(timer)
      },
      ...params
    })
  })

  return promiseRes
}

export default fetch
