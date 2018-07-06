/**
 * 微信鉴权相关
 * @author jialong
 * @version 1.0.0 | 2018-05-11
 */

import wepy from 'wepy'
import { getToken } from 'service/login'

const TOKEN_KEY = 'USER_TOKEN'
const USER_INFO_KEY = 'USER_INFO'

// 鉴权列表
const SCOPPS_LIST = [
  'scope.userInfo',
  'scope.userLocation',
  'scope.address',
  'scope.invoiceTitle',
  'scope.werun',
  'scope.record',
  'scope.writePhotosAlbum',
  'scope.camera'
]

function errorHandler (error = {}) {
  const { msg = '网络请求错误，请稍后重试' } = error
  wepy.hideLoading()
  wepy.showModal({
    title: '出错啦',
    content: msg,
    showCancel: false
  })
}

/**
 * 处理用户登录，保存和更新用户信息
 */
async function handleUserLogin() {
  let token = wepy.getStorageSync(TOKEN_KEY)
  if (token === '') {
    let loginRes = await wepy.login().catch(errorHandler)
    if (loginRes && loginRes.code) {
        // 去服务端鉴权
      let param = {
        code: loginRes.code
      }
      let token = await getToken(param)
      if (token) {
        wepy.setStorageSync(TOKEN_KEY, token)
      }
      return token
    }
  }
  return token
}

/**
 * 获取本地token
 */
async function getUserToken() {
  let token = wepy.getStorageSync(TOKEN_KEY)
  if (token === '') {
    token = await handleUserLogin()
  }
  return token
}

/**
 * 获取用户信息
 */
async function getUserInfo() {
  let userInfo = wx.getStorageSync(USER_INFO_KEY)
  const scope = 'scope.userInfo'
  const getUserInfo = () => {
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        withCredentials: true,
        lang: 'zh_CN',
        success({ userInfo = null }) {
          resolve(userInfo)
        },
        fail() {
          resolve(null)
        },
        complete() {}
      })
    })
  }
  if (Object.is(userInfo, '') || Object.is(userInfo, null)) {
    const auth = await scopeIsSetting(scope)
    if (Object.is(auth, undefined)) {
      userInfo = null
    } else {
      if (auth) {
        userInfo = await getUserInfo()
        wx.setStorageSync(USER_INFO_KEY, userInfo)
      } else {
        userInfo = null
      }
    }
  } 
  return userInfo
}

/**
 * 某个用户权限是否被设置 
 * scope: 用户权限
 * return: true 同意 false 拒绝 undefined 未被设置
 */
function scopeIsSetting(scope = '') {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success({ authSetting = {}, errMsg = '' }) {
        resolve(authSetting[scope])
      },
      fail({ errMsg = '' }) {
        resolve(undefined)
      },
      complete() {
        
      }
    })
  })
}

/**
 * 用户权限鉴权
 * scope: 用户权限
 * return: true 同意 false 拒绝
 */
function scopeAuthorize(scope = '') {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope: scope,
      success({ errMsg = '' }) {
        resolve(true)
      },
      fail({ errMsg = '' }) {
        resolve(false)
      },
      complete() {
        
      }
    })
  })
}

export { handleUserLogin, getUserToken, getUserInfo, scopeIsSetting, scopeAuthorize }
